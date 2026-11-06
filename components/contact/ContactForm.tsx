"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { AnimatedUnderline } from "@/components/ui/AnimatedUnderline";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  contactFields,
  contactLimits,
  emptyContactAnswers,
  enabledReasons,
  resolveContactCopy,
  validateContactAnswers,
  type ContactAnswers,
  type ContactErrors,
  type ContactField,
  type ContactSection,
} from "@/lib/contact";
import type { ContactMode } from "@/lib/contact/config";

type Props = {
  section: ContactSection;
  documentId: string;
  mode: ContactMode;
  contactEmail?: string;
};
const fieldLabels = {
  reason: "Anliegen",
  name: "Name",
  email: "E-Mail",
  message: "Nachricht",
};

export function ContactForm({
  section,
  documentId,
  mode,
  contactEmail = "hello@tapparo.de",
}: Props) {
  const copy = resolveContactCopy(section);
  const [reasons, setReasons] = useState(() => enabledReasons(section.reasons));
  const [answers, setAnswers] = useState<ContactAnswers>({
    ...emptyContactAnswers,
  });
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const busy = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const didNavigate = useRef(false);
  const ids = useId();
  const reduced = useReducedMotion();
  const reason = reasons.find((item) => item.value === answers.reason);
  const field = contactFields[step];
  const question =
    step === 0
      ? copy.reasonQuestion
      : step === 1
        ? copy.nameQuestion
        : step === 2
          ? copy.emailQuestion
          : step === 3
            ? reason?.messageQuestion || copy.messageQuestion
            : "Passt alles?";
  const hint =
    step === 2
      ? copy.emailHint
      : step === 3
        ? reason?.messageHint || copy.messageHint
        : "";

  useEffect(() => {
    setHydrated(true);
    const preselect = new URLSearchParams(window.location.search).get(
      "anliegen",
    );
    if (
      enabledReasons(section.reasons).some((item) => item.value === preselect)
    )
      setAnswers((current) => ({ ...current, reason: preselect! }));
  }, [section.reasons]);

  useEffect(() => {
    if (!didNavigate.current) return;
    heading.current?.focus({ preventScroll: true });
    // Measure after the new question and compact introduction have rendered.
    const target =
      step === 0
        ? form.current?.closest("section")
        : form.current || heading.current;
    const top = target?.getBoundingClientRect().top;
    if (
      top != null &&
      (top < 100 || window.matchMedia("(max-width: 767px)").matches)
    ) {
      window.scrollBy({ top: top - 100, behavior: "instant" });
    }
  }, [step, complete]);

  function change(field: ContactField, value: string) {
    setAnswers((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSendError("");
  }
  function navigate(next: number) {
    didNavigate.current = true;
    setStep(next);
  }
  function showFieldError(field: ContactField, message: string) {
    setErrors((current) => ({ ...current, [field]: message }));
    const input = form.current?.querySelector<
      HTMLInputElement | HTMLTextAreaElement
    >(`[name="${field}"]`);
    input?.focus();
  }
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated || busy.current) return;
    if (step === 4) {
      const submitter = (event.nativeEvent as SubmitEvent).submitter;
      if (submitter?.getAttribute("data-send") === "true") void send();
      return;
    }
    const error = validateContactAnswers(answers, reasons)[field];
    if (error) return showFieldError(field, error);
    navigate(editing ? 4 : step + 1);
    setEditing(false);
  }
  async function send() {
    if (busy.current || mode === "disabled") return;
    const invalid = validateContactAnswers(answers, reasons);
    const first = contactFields.find((key) => invalid[key]);
    if (first) {
      setErrors(invalid);
      navigate(contactFields.indexOf(first));
      return;
    }
    busy.current = true;
    setSending(true);
    setSendError("");
    const payload = { documentId, sectionKey: section._key, ...answers };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          website: new FormData(form.current!).get("website") || "",
        }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        if (Array.isArray(result.reasons)) {
          setReasons(enabledReasons(result.reasons));
          setEditing(false);
          navigate(0);
        }
        if (result.errors) {
          setErrors(result.errors);
          const key = contactFields.find((item) => result.errors[item]);
          if (key) navigate(contactFields.indexOf(key));
        }
        throw new Error(
          result.message ||
            "Deine Anfrage konnte gerade nicht gesendet werden. Bitte versuche es noch einmal.",
        );
      }
      didNavigate.current = true;
      setComplete(true);
      setAnswers({ ...emptyContactAnswers });
    } catch (error) {
      setSendError(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "Die Verbindung wurde unterbrochen. Deine Angaben bleiben erhalten. Bitte versuche es noch einmal.",
      );
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  const active =
    hydrated &&
    mode !== "disabled" &&
    reasons.length > 0 &&
    !!section.privacySlug;
  return (
    <section
      className="contact-section mx-auto w-full max-w-[var(--content-max-width)] px-[clamp(20px,_3.4vw,_72px)] pb-[clamp(64px,_7vw,_140px)] max-[768px]:px-5 [&_*]:min-w-0 [&_:is(button,a):focus-visible]:[outline:2px_solid_var(--color-accent)] [&_:is(button,a):focus-visible]:outline-offset-[5px] [&_button]:cursor-pointer [&_button:disabled]:cursor-wait [&_button:disabled]:opacity-[.5]"
      aria-label="Kontaktformular"
      data-contact-step={step}
    >
      <div className="mx-auto max-w-156">
        {mode === "demo" && (
          <p className="mb-6 border-t border-b border-solid border-t-border border-b-border px-0 py-3 text-[13px] leading-[1.5]">
            Formularvorschau · Es wird keine E-Mail versendet.
          </p>
        )}
        <noscript>
          <p>
            Bitte schreib uns direkt an{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Das geführte
            Formular benötigt JavaScript.
          </p>
        </noscript>
        {complete ? (
          <div className="pt-6 pb-14 [&_a]:mt-10 [&_p]:text-[18px] [&_p]:leading-[1.6]">
            <h2
              className="mb-6 scroll-mt-30 text-[clamp(28px,_3vw,_40px)] leading-[1.2] font-medium tracking-[-.035em] wrap-anywhere focus:[outline:none] max-[768px]:mb-5"
              ref={heading}
              tabIndex={-1}
            >
              Danke! So sieht die Bestätigung aus.
            </h2>
            <p>
              Die Vorschau ist abgeschlossen. Es wurde keine E-Mail versendet.
            </p>
            <TransitionLink
              href="/"
              className="animated-link relative inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
            >
              <span>zur Startseite</span>
              <AnimatedUnderline />
            </TransitionLink>
          </div>
        ) : (
          <>
            <p className="contact-intro mb-10 max-w-[48ch] text-[18px] leading-[1.6] max-[768px]:mb-8 max-[768px]:text-[16px]">
              {copy.introduction}
            </p>
            {mode === "disabled" || !reasons.length || !section.privacySlug ? (
              <p>
                Schreib uns für Catering oder andere Fragen gern direkt per
                E-Mail.
              </p>
            ) : (
              <form
                ref={form}
                onSubmit={advance}
                noValidate
                aria-busy={sending}
              >
                <div className="mb-3 flex items-center justify-between gap-6 text-[13px] leading-[1.5] [&_span:last-child]:tabular-nums">
                  <span>
                    {step < 4 ? `Frage ${step + 1} von 4` : "Deine Anfrage"}
                  </span>
                  <span aria-hidden="true">
                    {step < 4 ? `0${step + 1} / 04` : "Alles bereit"}
                  </span>
                </div>
                <div
                  className="mb-10 h-[2px] bg-border max-[768px]:mb-6 [&_span]:block [&_span]:h-full [&_span]:bg-accent [&_span]:[transition:width_280ms_ease] motion-reduce:[&_span]:transition-none"
                  aria-hidden="true"
                >
                  <span
                    style={{ width: `${Math.min((step + 1) / 4, 1) * 100}%` }}
                  />
                </div>
                <motion.div
                  key={step}
                  className="min-h-[290px] max-[768px]:min-h-50"
                  initial={
                    didNavigate.current && !reduced
                      ? { opacity: 0, y: 10 }
                      : false
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.24,
                    ease: [0.2, 0.7, 0.2, 1],
                  }}
                >
                  <h2
                    id={`${ids}-question`}
                    className="mb-6 scroll-mt-30 text-[clamp(28px,_3vw,_40px)] leading-[1.2] font-medium tracking-[-.035em] wrap-anywhere focus:[outline:none] max-[768px]:mb-5"
                    ref={heading}
                    tabIndex={-1}
                  >
                    {question}
                  </h2>
                  {hint && (
                    <p
                      id={`${ids}-hint`}
                      className="mx-0 -mt-2 mb-6 max-w-[56ch] text-[16px] leading-[1.6] max-[768px]:mb-5"
                    >
                      {hint}
                    </p>
                  )}
                  {step === 0 && (
                    <fieldset
                      role="radiogroup"
                      aria-labelledby={`${ids}-question`}
                      aria-describedby={
                        errors.reason ? `${ids}-error` : undefined
                      }
                      aria-invalid={!!errors.reason}
                      aria-required="true"
                      disabled={!active}
                    >
                      <legend className="sr-only">{copy.reasonQuestion}</legend>
                      <div className="grid border-t border-solid border-t-border">
                        {reasons.map((item) => (
                          <label
                            key={item._key}
                            className="relative flex cursor-pointer items-center gap-5 border-b border-solid border-b-border px-0 py-[19px] text-[clamp(20px,_2vw,_26px)] leading-[1.3] max-[768px]:gap-4 max-[768px]:py-[18px] [&_input]:mx-0 [&_input]:my-0 [&_input]:h-5 [&_input]:w-5 [&_input]:shrink-0 [&_input]:appearance-none [&_input]:rounded-full [&_input]:border [&_input]:border-solid [&_input]:border-current [&_input:checked]:[border-color:var(--color-accent)] [&_input:checked]:bg-accent [&_input:checked]:[box-shadow:inset_0_0_0_4px_var(--color-background)] [&_span]:wrap-anywhere [&:has(input:checked)]:border-b-accent [&:has(input:focus-visible)]:[outline:2px_solid_var(--color-accent)] [&:has(input:focus-visible)]:outline-offset-[5px]"
                          >
                            <input
                              type="radio"
                              name="reason"
                              value={item.value}
                              checked={answers.reason === item.value}
                              onChange={() => change("reason", item.value)}
                              aria-describedby={
                                errors.reason ? `${ids}-error` : undefined
                              }
                              required
                            />
                            <span>{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  {(step === 1 || step === 2) && (
                    <>
                      <label className="sr-only" htmlFor={`${ids}-input`}>
                        {fieldLabels[field]}
                      </label>
                      <input
                        id={`${ids}-input`}
                        className="block w-full rounded-none border-t-0 border-r-0 border-b border-l-0 border-solid [border-top-style:none] [border-right-style:none] [border-left-style:none] border-t-current border-r-current border-b-foreground border-l-current bg-transparent px-0 py-3 [font-family:inherit] text-[clamp(22px,_2.2vw,_30px)] leading-[1.4] [font-weight:inherit] text-inherit [font-style:inherit] [font-variant:inherit] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] [&::placeholder]:text-foreground [&::placeholder]:opacity-[.45] [&[aria-invalid=true]]:[border-color:#923c2e]"
                        name={field}
                        type={step === 2 ? "email" : "text"}
                        autoComplete={step === 2 ? "email" : "name"}
                        inputMode={step === 2 ? "email" : "text"}
                        autoCapitalize={step === 2 ? "none" : "words"}
                        spellCheck={step !== 2}
                        value={answers[field]}
                        maxLength={contactLimits[field]}
                        onChange={(event) => change(field, event.target.value)}
                        required
                        disabled={!active}
                        aria-describedby={
                          [
                            hint && `${ids}-hint`,
                            errors[field] && `${ids}-error`,
                          ]
                            .filter(Boolean)
                            .join(" ") || undefined
                        }
                        aria-invalid={!!errors[field]}
                      />
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <label className="sr-only" htmlFor={`${ids}-message`}>
                        {fieldLabels.message}
                      </label>
                      <textarea
                        id={`${ids}-message`}
                        className="block min-h-50 w-full resize-y rounded-none border border-solid border-foreground bg-transparent px-4 py-4 [font-family:inherit] text-[18px] leading-[1.6] [font-weight:inherit] text-inherit [font-style:inherit] [font-variant:inherit] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] max-[768px]:h-[clamp(160px,_26svh,_220px)] max-[768px]:min-h-40 max-[768px]:text-[16px] [&::placeholder]:text-foreground [&::placeholder]:opacity-[.45] [&[aria-invalid=true]]:[border-color:#923c2e]"
                        name="message"
                        value={answers.message}
                        maxLength={contactLimits.message}
                        rows={6}
                        onChange={(event) =>
                          change("message", event.target.value)
                        }
                        required
                        disabled={!active}
                        aria-describedby={`${ids}-hint ${ids}-count${errors.message ? ` ${ids}-error` : ""}`}
                        aria-invalid={!!errors.message}
                      />
                      <p
                        id={`${ids}-count`}
                        className="mt-3 text-right text-[13px] tabular-nums"
                      >
                        {answers.message.length.toLocaleString("de-DE")} / 5.000
                        Zeichen
                      </p>
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <dl className="mt-3 grid [&_>_div]:grid [&_>_div]:grid-cols-[minmax(0,_1fr)_auto] [&_>_div]:gap-x-6 [&_>_div]:gap-y-2 [&_>_div]:border-t [&_>_div]:border-solid [&_>_div]:border-t-border [&_>_div]:py-5 max-[768px]:[&_>_div]:gap-x-4 max-[768px]:[&_>_div]:gap-y-2 [&_button]:col-[2] [&_button]:row-[1_/_span_2] [&_button]:min-h-11 [&_button]:self-start [&_button]:text-[14px] [&_button]:underline [&_button]:underline-offset-[4px] [&_dd]:row-[2] [&_dd]:text-[18px] [&_dd]:leading-[1.6] [&_dd]:wrap-anywhere [&_dd]:whitespace-pre-wrap max-[768px]:[&_dd]:text-[16px] [&_dt]:text-[13px]">
                        {contactFields.map((key, index) => (
                          <div key={key}>
                            <dt>{fieldLabels[key]}</dt>
                            <dd>
                              {key === "reason" ? reason?.label : answers[key]}
                            </dd>
                            <button
                              type="button"
                              disabled={sending}
                              onClick={() => {
                                setEditing(true);
                                navigate(index);
                              }}
                              aria-label={`${fieldLabels[key]} ändern`}
                            >
                              ändern
                            </button>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-7 text-[14px] leading-[1.6] [&_a]:underline [&_a]:underline-offset-[4px]">
                        Wir verwenden deine Angaben, um deine Anfrage zu
                        beantworten. Mehr dazu in unserer{" "}
                        <TransitionLink href={`/${section.privacySlug}`}>
                          Datenschutzerklärung
                        </TransitionLink>
                        .
                      </p>
                    </>
                  )}
                  {field && errors[field] && (
                    <p
                      id={`${ids}-error`}
                      className="mt-5 text-[15px] leading-[1.6] text-[#923c2e]"
                      role="alert"
                    >
                      {errors[field]}
                    </p>
                  )}
                </motion.div>
                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                {sendError && (
                  <p
                    className="mt-5 text-[15px] leading-[1.6] text-[#923c2e]"
                    role="alert"
                  >
                    {sendError}
                  </p>
                )}
                <div className="mt-10 flex items-center justify-between gap-5 max-[768px]:mt-6">
                  {step > 0 && (
                    <button
                      className="min-h-11 text-[15px] underline underline-offset-[5px] hover:decoration-accent"
                      type="button"
                      disabled={sending}
                      onClick={() => {
                        setEditing(false);
                        navigate(step - 1);
                      }}
                    >
                      Zurück
                    </button>
                  )}
                  <button
                    type="submit"
                    data-send={step === 4 ? "true" : undefined}
                    className="animated-link relative ml-auto inline-flex min-h-11 max-w-full items-center px-[2px] pt-2 pb-[14px] text-[17px] leading-[1.4] font-medium tracking-[0.06em] wrap-anywhere text-foreground [transition:color_0.2s_ease] focus-visible:[outline:2px_solid_var(--color-accent)] focus-visible:outline-offset-[6px] motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:absolute [&_svg]:bottom-0 [&_svg]:left-0 [&_svg]:h-3 [&_svg]:w-full [&:hover_svg]:text-accent"
                    disabled={!active || sending}
                  >
                    <span>
                      {sending
                        ? "Wird gesendet …"
                        : step === 4
                          ? copy.submitLabel
                          : editing
                            ? "Übernehmen"
                            : "Weiter"}
                    </span>
                    <AnimatedUnderline />
                  </button>
                </div>
              </form>
            )}
          </>
        )}
        <p className="mt-10 text-[14px] leading-[1.6] [&_a]:inline-block [&_a]:min-h-11 [&_a]:py-3 [&_a]:wrap-anywhere [&_a]:underline [&_a]:underline-offset-[5px]">
          Lieber direkt schreiben?
          <br />
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      </div>
    </section>
  );
}
