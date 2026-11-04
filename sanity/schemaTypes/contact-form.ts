import { defineArrayMember, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import { contactCopy, initialContactReasons, reasonIdentifier } from "../../lib/contact";

export const sectionContactForm = defineArrayMember({
  name: "sectionContactForm", title: "Contact Form", type: "object", icon: EnvelopeIcon,
  description: "A short enquiry flow. Messages go to the configured restaurant inbox; visitor data is never stored in Sanity.",
  initialValue: { ...contactCopy, reasons: initialContactReasons.map(reason => ({ ...reason, _type: "contactReason" })) },
  fieldsets: [
    { name: "questions", title: "Questions and help text", options: { collapsible: true, collapsed: true } },
    { name: "confirmation", title: "Submission and confirmation", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({ name: "introduction", type: "text", rows: 2, validation: rule => rule.max(300) }),
    defineField({
      name: "reasons", title: "Enquiry reasons", type: "array",
      description: "Drag to reorder. The first option appears first. Disable a reason to remove it from the form.",
      validation: rule => rule.required().min(1).max(8).custom((items) => {
        if (!items) return true;
        const reasons = items as { value?: string; enabled?: boolean }[];
        if (!reasons.some(reason => reason.enabled !== false)) return "Enable at least one reason.";
        const values = reasons.map(reason => reason.value).filter(Boolean);
        return new Set(values).size === values.length || "Each reason needs a unique link identifier.";
      }),
      of: [defineArrayMember({
        name: "contactReason", title: "Reason", type: "object", icon: EnvelopeIcon,
        initialValue: { enabled: true },
        fields: [
          defineField({ name: "label", type: "string", validation: rule => rule.required().max(80).custom(value => !value || value.trim() ? true : "Enter a label.") }),
          defineField({ name: "value", title: "Link identifier", type: "string", description: "A unique lowercase word, e.g. catering. Keep it unchanged after linking to /kontakt?anliegen=catering.", validation: rule => rule.required().max(64).regex(reasonIdentifier) }),
          defineField({ name: "enabled", type: "boolean", initialValue: true }),
          defineField({ name: "messageQuestion", title: "Message question (optional)", type: "string", validation: rule => rule.max(150) }),
          defineField({ name: "messageHint", title: "Message help text (optional)", type: "text", rows: 3, validation: rule => rule.max(400) }),
        ],
        preview: { select: { title: "label", enabled: "enabled", value: "value" }, prepare: ({ title, enabled, value }) => ({ title, subtitle: `${enabled === false ? "Disabled · " : ""}${value || "Missing link identifier"}` }) },
      })],
    }),
    ...(["reasonQuestion", "nameQuestion", "emailQuestion", "messageQuestion"] as const).map(name => defineField({ name, type: "string", fieldset: "questions", validation: rule => rule.max(150) })),
    ...(["emailHint", "messageHint"] as const).map(name => defineField({ name, type: "text", rows: 2, fieldset: "questions", validation: rule => rule.max(400) })),
    defineField({ name: "submitLabel", title: "Send button label", type: "string", fieldset: "confirmation", validation: rule => rule.max(60) }),
    defineField({ name: "successTitle", title: "Confirmation heading", type: "string", fieldset: "confirmation", validation: rule => rule.max(150) }),
    defineField({ name: "successMessage", title: "Confirmation text", type: "text", rows: 3, fieldset: "confirmation", validation: rule => rule.max(400) }),
    defineField({ name: "privacyPage", title: "Privacy information", type: "reference", to: [{ type: "legalPage" }], description: "Select the legal page that contains the privacy notice.", validation: rule => rule.required() }),
  ],
  preview: { select: { reasons: "reasons" }, prepare: ({ reasons }) => ({ title: "Contact Form", subtitle: `${reasons?.filter((r: { enabled?: boolean }) => r.enabled !== false).length || 0} enabled reasons` }) },
});
