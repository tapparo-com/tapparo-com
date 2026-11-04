export type ContactReason = {
  _key: string;
  value: string;
  label: string;
  enabled?: boolean;
  messageQuestion?: string;
  messageHint?: string;
};
export const contactCopy = {
  introduction: "Catering, eine Idee oder einfach eine Frage? Erzähl uns davon.",
  reasonQuestion: "Worum geht’s?",
  nameQuestion: "Wie heißt du?",
  emailQuestion: "Wie können wir dich erreichen?",
  emailHint: "Wir antworten dir per E-Mail.",
  messageQuestion: "Was möchtest du uns erzählen?",
  messageHint: "Schreib uns, was dir auf dem Herzen liegt.",
  submitLabel: "Anfrage senden",
  successTitle: "Danke für deine Anfrage!",
  successMessage: "Wir melden uns per E-Mail bei dir.",
};
export type ContactCopy = typeof contactCopy;
export type ContactSection = Partial<ContactCopy> & {
  _key: string;
  _type: "sectionContactForm";
  reasons?: ContactReason[] | null;
  privacySlug?: string | null;
};
export const initialContactReasons: ContactReason[] = [
  { _key: "catering", value: "catering", label: "Catering anfragen", enabled: true,
    messageQuestion: "Was hast du vor?", messageHint: "Wann, wo und für wie viele Gäste? Falls du es schon weißt, erzähl uns gern ein bisschen über deinen Anlass." },
  { _key: "frage", value: "frage", label: "Frage zu Tapparo", enabled: true },
  { _key: "sonstiges", value: "sonstiges", label: "Sonstiges", enabled: true },
];
export const contactFields = ["reason", "name", "email", "message"] as const;
export type ContactField = typeof contactFields[number];
export type ContactAnswers = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;
export const emptyContactAnswers: ContactAnswers = { reason: "", name: "", email: "", message: "" };
export const contactLimits = { name: 120, email: 254, message: 5000, reason: 64 };
export const reasonIdentifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function enabledReasons(reasons: ContactReason[] | null | undefined): ContactReason[] {
  const seen = new Set<string>();
  return (reasons || []).filter(reason => {
    if (!reason || reason.enabled === false || !reasonIdentifier.test(reason.value || "") || !reason.label?.trim() || seen.has(reason.value)) return false;
    seen.add(reason.value);
    return true;
  });
}

export function resolveContactCopy(section: Partial<ContactCopy>): ContactCopy {
  return Object.fromEntries(Object.entries(contactCopy).map(([key, fallback]) => [key, section[key as keyof ContactCopy]?.trim() || fallback])) as ContactCopy;
}

export function validateContactAnswers(answers: ContactAnswers, reasons: ContactReason[]): ContactErrors {
  const errors: ContactErrors = {};
  if (!enabledReasons(reasons).some(reason => reason.value === answers.reason)) errors.reason = "Bitte wähle ein Anliegen aus.";
  if (!answers.name.trim() || answers.name.trim().length > contactLimits.name || /[\r\n\x00-\x1f\x7f]/.test(answers.name)) errors.name = "Bitte gib deinen Namen ein (maximal 120 Zeichen).";
  if (answers.email.length > contactLimits.email || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(answers.email.trim()) || /[\x00-\x1f\x7f]/.test(answers.email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse ein.";
  if (!answers.message.trim() || answers.message.length > contactLimits.message || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(answers.message)) errors.message = "Bitte schreib uns eine Nachricht (maximal 5.000 Zeichen).";
  return errors;
}
