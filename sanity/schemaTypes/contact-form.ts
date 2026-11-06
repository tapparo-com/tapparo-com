import { defineArrayMember, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons";
import {
  contactCopy,
  initialContactReasons,
  reasonIdentifier,
} from "../../lib/contact";

export const sectionContactForm = defineArrayMember({
  name: "sectionContactForm",
  title: "Contact Form",
  type: "object",
  icon: EnvelopeIcon,
  description:
    "A fixed four-step enquiry form: reason, name, email and message, followed by review. Edit its wording and reasons here; fields, required answers, step order, recipient and delivery activation are managed outside Studio. Development preview sends no email. Visitor enquiries are not stored in Sanity. Use one form per page.",
  initialValue: {
    ...contactCopy,
    reasons: initialContactReasons.map((reason) => ({
      ...reason,
      _type: "contactReason",
    })),
  },
  fieldsets: [
    {
      name: "questions",
      title: "Questions and help text",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "confirmation",
      title: "Submission and confirmation",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "introduction",
      type: "text",
      rows: 2,
      description:
        "Text above the questions. On mobile it is shown only on the first step. Leave empty to use the default German introduction; clearing it does not hide it. The page heading is edited in the parent page's Title field.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "reasons",
      title: "Enquiry reasons",
      type: "array",
      description:
        "Add 1–8 reasons and drag to set their display order. Keep at least one enabled. Reasons change the choices and can override the message prompt; they do not add questions or change the receiving inbox.",
      validation: (rule) =>
        rule
          .required()
          .min(1)
          .max(8)
          .custom((items) => {
            if (!items) return true;
            const reasons = items as { value?: string; enabled?: boolean }[];
            if (!reasons.some((reason) => reason.enabled !== false))
              return "Enable at least one reason.";
            const values = reasons
              .map((reason) => reason.value)
              .filter(Boolean);
            return (
              new Set(values).size === values.length ||
              "Each reason needs a unique link identifier."
            );
          }),
      of: [
        defineArrayMember({
          name: "contactReason",
          title: "Reason",
          type: "object",
          icon: EnvelopeIcon,
          initialValue: { enabled: true },
          fields: [
            defineField({
              name: "label",
              type: "string",
              description:
                "Choice text shown in step 1, the review and the enquiry email. Changing this text does not change the link identifier.",
              validation: (rule) =>
                rule
                  .required()
                  .max(80)
                  .custom((value) =>
                    !value || value.trim() ? true : "Enter a label.",
                  ),
            }),
            defineField({
              name: "value",
              title: "Link identifier",
              type: "string",
              description:
                "A unique lowercase word, e.g. catering. Keep it unchanged after linking to /kontakt?anliegen=catering.",
              validation: (rule) =>
                rule.required().max(64).regex(reasonIdentifier),
            }),
            defineField({
              name: "enabled",
              type: "boolean",
              initialValue: true,
              description:
                "Turn off to hide this reason without deleting it. Disabled reasons cannot be preselected by a link or submitted. This does not disable the whole form.",
            }),
            defineField({
              name: "messageQuestion",
              title: "Message question (optional)",
              type: "string",
              description:
                "Replaces the step 4 question only when this reason is selected. Leave empty to use the general message question below.",
              validation: (rule) => rule.max(150),
            }),
            defineField({
              name: "messageHint",
              title: "Message help text (optional)",
              type: "text",
              rows: 3,
              description:
                "Replaces step 4 guidance for this reason, for example asking for a catering date and guest count. Leave empty to use the general message help text. This does not create extra required fields.",
              validation: (rule) => rule.max(400),
            }),
          ],
          preview: {
            select: { title: "label", enabled: "enabled", value: "value" },
            prepare: ({ title, enabled, value }) => ({
              title,
              subtitle: `${enabled === false ? "Disabled · " : ""}${value || "Missing link identifier"}`,
            }),
          },
        }),
      ],
    }),
    ...(
      [
        "reasonQuestion",
        "nameQuestion",
        "emailQuestion",
        "messageQuestion",
      ] as const
    ).map((name) =>
      defineField({
        name,
        type: "string",
        fieldset: "questions",
        title: {
          reasonQuestion: "Step 1 — reason question",
          nameQuestion: "Step 2 — name question",
          emailQuestion: "Step 3 — email question",
          messageQuestion: "Step 4 — default message question",
        }[name],
        description:
          name === "messageQuestion"
            ? "Default heading above the message box. A selected reason can override it. Leave empty to use the default German question; the message remains required."
            : "Question heading for this fixed step. Leave empty to use the default German question. Changing or clearing the wording does not remove the step or make its answer optional.",
        validation: (rule) => rule.max(150),
      }),
    ),
    ...(["emailHint", "messageHint"] as const).map((name) =>
      defineField({
        name,
        type: "text",
        rows: 2,
        fieldset: "questions",
        title:
          name === "emailHint"
            ? "Step 3 — email help text"
            : "Step 4 — default message help text",
        description:
          name === "emailHint"
            ? "Guidance below the email question. Leave empty to use the default German guidance; it cannot be hidden by clearing this field."
            : "Default guidance above the message box. A selected reason can override it. Leave empty to use the default German guidance; clearing it does not hide it.",
        validation: (rule) => rule.max(400),
      }),
    ),
    defineField({
      name: "submitLabel",
      title: "Send button label",
      type: "string",
      fieldset: "confirmation",
      description:
        "Final action on the review screen, in preview and live mode. Leave empty for 'Anfrage senden'. Next, Back, Edit and sending-state text are fixed by the site.",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "successTitle",
      title: "Confirmation heading",
      type: "string",
      fieldset: "confirmation",
      description:
        "Heading after an enquiry is accepted in live mode. Leave empty for the default German heading. Development preview always uses its own fixed confirmation, so edits here do not appear in preview completion.",
      validation: (rule) => rule.max(150),
    }),
    defineField({
      name: "successMessage",
      title: "Confirmation text",
      type: "text",
      rows: 3,
      fieldset: "confirmation",
      description:
        "Text after an enquiry is accepted in live mode; this is not an email sent to the visitor. Leave empty for the default German text. Preview confirmation and the reference number are not editable here.",
      validation: (rule) => rule.max(400),
    }),
    defineField({
      name: "privacyPage",
      title: "Privacy information",
      type: "reference",
      to: [{ type: "legalPage" }],
      description:
        "Select and publish the legal page containing the privacy notice. The review links to that page. A missing or unpublished destination makes the form unavailable; the direct email link remains. Edit the legal text in the selected document.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { reasons: "reasons" },
    prepare: ({ reasons }) => ({
      title: "Contact Form",
      subtitle: `${reasons?.filter((r: { enabled?: boolean }) => r.enabled !== false).length || 0} enabled reasons`,
    }),
  },
});
