import { defineQuery } from "next-sanity";

export const contactFormFields = /* groq */ `
  _key, _type, introduction, reasonQuestion, nameQuestion, emailQuestion, emailHint,
  messageQuestion, messageHint, submitLabel, successTitle, successMessage,
  reasons[]{ _key, value, label, enabled, messageQuestion, messageHint },
  "privacySlug": lower(privacyPage->slug.current)
`;
export const CONTACT_FORM_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && _id == $documentId && defined(slug.current)][0]
    .sections[_type == "sectionContactForm" && _key == $sectionKey][0]{ ${contactFormFields} }
`);
