"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { AnimatedUnderline } from "@/components/homepage/AnimatedUnderline";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { contactFields, contactLimits, emptyContactAnswers, enabledReasons, resolveContactCopy, validateContactAnswers, type ContactAnswers, type ContactErrors, type ContactField, type ContactSection } from "@/lib/contact";
import { ContactChallenge } from "./ContactChallenge";
import shared from "@/components/homepage/Homepage.module.css";
import page from "@/components/pages/Pages.module.css";
import styles from "./ContactForm.module.css";

type Props = { section: ContactSection; documentId: string; mode: "demo" | "live" | "disabled"; siteKey?: string };
const fieldLabels = { reason: "Anliegen", name: "Name", email: "E-Mail", message: "Nachricht" };
const fallbackEmail = "hello@tapparo.com";

export function ContactForm({ section, documentId, mode, siteKey }: Props) {
  const copy = resolveContactCopy(section);
  const [reasons, setReasons] = useState(() => enabledReasons(section.reasons));
  const [answers, setAnswers] = useState<ContactAnswers>({ ...emptyContactAnswers });
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<{ reference: string; demo: boolean } | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState("");
  const [challengeReset, setChallengeReset] = useState(0);
  const [challengeError, setChallengeError] = useState("");
  const submission = useRef<{ payload: string; id: string } | null>(null);
  const busy = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const didNavigate = useRef(false);
  const ids = useId();
  const reduced = useReducedMotion();
  const reason = reasons.find(item => item.value === answers.reason);
  const field = contactFields[step];
  const question = step === 0 ? copy.reasonQuestion : step === 1 ? copy.nameQuestion : step === 2 ? copy.emailQuestion : step === 3 ? reason?.messageQuestion || copy.messageQuestion : "Passt alles?";
  const hint = step === 2 ? copy.emailHint : step === 3 ? reason?.messageHint || copy.messageHint : "";

  useEffect(() => {
    setHydrated(true);
    const preselect = new URLSearchParams(window.location.search).get("anliegen");
    if (enabledReasons(section.reasons).some(item => item.value === preselect)) setAnswers(current => ({ ...current, reason: preselect! }));
  }, [section.reasons]);

  useEffect(() => {
    if (didNavigate.current) heading.current?.focus({ preventScroll: true });
  }, [step, receipt]);

  function change(field: ContactField, value: string) {
    setAnswers(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setSendError("");
  }
  function navigate(next: number) {
    didNavigate.current = true;
    setStep(next);
    // Keep a long message/review from leaving the next question above the viewport.
    const top = form.current?.getBoundingClientRect().top;
    if (top != null && top < 110) window.scrollBy({ top: top - 120, behavior: "instant" });
  }
  function showFieldError(field: ContactField, message: string) {
    setErrors(current => ({ ...current, [field]: message }));
    const input = form.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${field}"]`);
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
    const first = contactFields.find(key => invalid[key]);
    if (first) { setErrors(invalid); navigate(contactFields.indexOf(first)); return; }
    if (mode === "live" && !token) { setChallengeError("Bitte schließe die Sicherheitsprüfung ab."); return; }
    busy.current = true;
    setSending(true);
    setSendError("");
    const payload = { documentId, sectionKey: section._key, ...answers };
    const fingerprint = JSON.stringify(payload);
    if (submission.current?.payload !== fingerprint) submission.current = { payload: fingerprint, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, submissionId: submission.current.id, token, website: new FormData(form.current!).get("website") || "" }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        if (Array.isArray(result.reasons)) { setReasons(enabledReasons(result.reasons)); setEditing(false); navigate(0); }
        if (result.errors) { setErrors(result.errors); const key = contactFields.find(item => result.errors[item]); if (key) navigate(contactFields.indexOf(key)); }
        throw new Error(result.message || "Deine Anfrage konnte gerade nicht gesendet werden. Bitte versuche es noch einmal.");
      }
      didNavigate.current = true;
      setReceipt({ reference: result.reference, demo: result.demo === true });
      setAnswers({ ...emptyContactAnswers });
      submission.current = null;
    } catch (error) {
      setSendError(error instanceof Error && error.name === "Error" ? error.message : "Die Verbindung wurde unterbrochen. Deine Angaben bleiben erhalten. Bitte versuche es noch einmal.");
    } finally {
      busy.current = false;
      setSending(false);
      setToken("");
      setChallengeReset(value => value + 1);
    }
  }

  const active = hydrated && mode !== "disabled" && reasons.length > 0 && !!section.privacySlug;
  return <section className={`${page.container} ${styles.section}`} aria-label="Kontaktformular">
    <div className={styles.inner}>
      {mode === "demo" && <p className={styles.preview}>Formularvorschau · Es wird keine E-Mail versendet.</p>}
      <noscript><p>Bitte schreib uns direkt an <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>. Das geführte Formular benötigt JavaScript.</p></noscript>
      {receipt ? <div className={styles.confirmation}>
        <h2 className={styles.question} ref={heading} tabIndex={-1}>{receipt.demo ? "Danke! So sieht die Bestätigung aus." : copy.successTitle}</h2>
        <p>{receipt.demo ? "Die Vorschau ist abgeschlossen. Es wurde keine E-Mail versendet." : copy.successMessage}</p>
        {!receipt.demo && <p className={styles.reference}>Deine Referenz: {receipt.reference}</p>}
        <TransitionLink href="/" className={shared.animatedLink}><span>zur Startseite</span><AnimatedUnderline /></TransitionLink>
      </div> : <>
        <p className={styles.intro}>{copy.introduction}</p>
        {mode === "disabled" || !reasons.length || !section.privacySlug ? <p>Schreib uns für Catering oder andere Fragen gern direkt per E-Mail.</p> : <form ref={form} onSubmit={advance} noValidate aria-busy={sending}>
          <div className={styles.progress}><span>{step < 4 ? `Frage ${step + 1} von 4` : "Deine Anfrage"}</span><span aria-hidden="true">{step < 4 ? `0${step + 1} / 04` : "Alles bereit"}</span></div>
          <div className={styles.track} aria-hidden="true"><span style={{ width: `${Math.min((step + 1) / 4, 1) * 100}%` }} /></div>
          <motion.div key={step} className={styles.step} initial={didNavigate.current && !reduced ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .24, ease: [.2, .7, .2, 1] }}>
            <h2 id={`${ids}-question`} className={styles.question} ref={heading} tabIndex={-1}>{question}</h2>
            {hint && <p id={`${ids}-hint`} className={styles.hint}>{hint}</p>}
            {step === 0 && <fieldset aria-labelledby={`${ids}-question`} aria-describedby={errors.reason ? `${ids}-error` : undefined} disabled={!active}>
              <legend className="sr-only">{copy.reasonQuestion}</legend>
              <div className={styles.choices}>{reasons.map(item => <label key={item._key} className={styles.choice}>
                <input type="radio" name="reason" value={item.value} checked={answers.reason === item.value} onChange={() => change("reason", item.value)} aria-invalid={!!errors.reason} required />
                <span>{item.label}</span>
              </label>)}</div>
            </fieldset>}
            {(step === 1 || step === 2) && <>
              <label className="sr-only" htmlFor={`${ids}-input`}>{fieldLabels[field]}</label>
              <input id={`${ids}-input`} className={styles.input} name={field} type={step === 2 ? "email" : "text"} autoComplete={step === 2 ? "email" : "name"} inputMode={step === 2 ? "email" : "text"} autoCapitalize={step === 2 ? "none" : "words"} spellCheck={step !== 2}
                value={answers[field]} maxLength={contactLimits[field]} onChange={event => change(field, event.target.value)} required disabled={!active}
                aria-describedby={[hint && `${ids}-hint`, errors[field] && `${ids}-error`].filter(Boolean).join(" ") || undefined} aria-invalid={!!errors[field]} />
            </>}
            {step === 3 && <>
              <label className="sr-only" htmlFor={`${ids}-message`}>{fieldLabels.message}</label>
              <textarea id={`${ids}-message`} className={`${styles.input} ${styles.message}`} name="message" value={answers.message} maxLength={contactLimits.message} rows={6} onChange={event => change("message", event.target.value)} required disabled={!active}
                aria-describedby={`${ids}-hint ${ids}-count${errors.message ? ` ${ids}-error` : ""}`} aria-invalid={!!errors.message} />
              <p id={`${ids}-count`} className={styles.count}>{answers.message.length.toLocaleString("de-DE")} / 5.000 Zeichen</p>
            </>}
            {step === 4 && <>
              <dl className={styles.review}>{contactFields.map((key, index) => <div key={key}>
                <dt>{fieldLabels[key]}</dt><dd>{key === "reason" ? reason?.label : answers[key]}</dd>
                <button type="button" disabled={sending} onClick={() => { setEditing(true); navigate(index); }} aria-label={`${fieldLabels[key]} ändern`}>ändern</button>
              </div>)}</dl>
              <p className={styles.privacy}>Wir verwenden deine Angaben, um deine Anfrage zu beantworten. Mehr dazu in unserer <TransitionLink href={`/${section.privacySlug}`}>Datenschutzerklärung</TransitionLink>.</p>
              {mode === "live" && siteKey && <ContactChallenge siteKey={siteKey} resetKey={challengeReset} onToken={setToken} onError={setChallengeError} />}
              {challengeError && <p className={styles.error} role="alert">{challengeError}</p>}
            </>}
            {field && errors[field] && <p id={`${ids}-error`} className={styles.error} role="alert">{errors[field]}</p>}
          </motion.div>
          <div className={styles.trap} aria-hidden="true"><label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
          {sendError && <p className={styles.error} role="alert">{sendError}</p>}
          <div className={styles.actions}>
            {step > 0 && <button className={styles.back} type="button" disabled={sending} onClick={() => { setEditing(false); navigate(step - 1); }}>Zurück</button>}
            <button type="submit" data-send={step === 4 ? "true" : undefined} className={`${shared.animatedLink} ${styles.primary}`} disabled={!active || sending}>
              <span>{sending ? "Wird gesendet …" : step === 4 ? copy.submitLabel : editing ? "Übernehmen" : "Weiter"}</span><AnimatedUnderline />
            </button>
          </div>
        </form>}
      </>}
      <p className={styles.fallback}>Lieber direkt schreiben?<br /><a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a></p>
    </div>
  </section>;
}
