# Kontakt page implementation plan

Created: 4 November 2026  
Status: Approved for implementation on 4 November 2026 after committing milestone 7.

Create `/kontakt` as a short, welcoming enquiry flow that helps visitors ask about catering or contact Tapparo. The experience should feel like the existing website, with one question at a time and a clear route to sending a message. Completion means a qualified enquiry sent to `hello@tapparo.com`; this is not a booking confirmation or a newsletter subscription.

This is milestone **7.1**, after the approved secondary pages and before milestone 8. Implement in development with test delivery. Provider setup and live sending remain pending; commit the new implementation only after lock-in.

## Proposed visitor flow

Start directly with the first question under a compact Kontakt introduction; avoid a separate welcome screen and extra start click.

| Step | Suggested German copy | Input and behavior |
| --- | --- | --- |
| 1 | Worum geht’s? | One choice from the owner-managed reasons. Initial proposal: Catering anfragen, Frage zu Tapparo, Sonstiges. Catering comes first. |
| 2 | Wie heißt du? | One full-name field with name autocomplete; no separate first/last-name fields. |
| 3 | Wie können wir dich erreichen? | Email with email autocomplete and the mobile email keyboard. |
| 4 | Was hast du vor? | Multiline message. For catering, suggest mentioning date, approximate guest count and location, if known. Other reasons receive suitable helper text. |
| Review | Passt alles? | Compact summary, edit links, privacy information and “Anfrage senden”. |
| Success | Danke für deine Anfrage! | Confirm successful submission and explain that Tapparo will reply by email. Avoid promising an unconfirmed response time. |

Reason, name, email and message are required. Keep dates, guest counts and budgets out of separate mandatory fields in the first version. The owner should receive useful context without visitors needing an event plan before getting in touch.

Show progress, “Zurück” and “Weiter”; keep primary actions on the right. Keep answers when moving backward, opening the site menu or retrying a failed submission. Selecting a reason should not unexpectedly advance focus. Enter advances single-line steps; Enter in the message field inserts a line break. The final send always requires an explicit action.

## Design and interaction

- Reuse the warm background, dark text, orange accent, Instrument Sans/Space Grotesk, viewport outline, transparent header, menu and compact footer.
- Center the form in the shared site container with a readable width around 624 px. Use the compact secondary-page title scale. Let the layout scroll on small screens, with the keyboard open, or at increased text size.
- Use quiet input underlines, clear labels, generous answer targets and the existing animated hand-drawn underline for actions. Reason options get an obvious selected state and keyboard focus.
- Animate question changes with a short fade and small vertical movement using the existing Motion dependency. Respect reduced motion and avoid replaying the homepage welcome between questions.
- Use native form controls, fieldsets/legends for choices, associated labels, focused step headings and announced errors/status. Inactive questions must not remain focusable.
- Show helpful field errors immediately beside the relevant field. Preserve answers during network/provider/challenge errors and offer retry plus direct email. Without JavaScript or with the challenge unavailable, expose a usable email link rather than an unprotected submission path.

## CMS editing model

Use **Pages → Kontakt**, an ordinary `page` document with slug `kontakt` and a new reusable **Contact Form** section. This follows the existing sections-build-pages model and works with the current page references, SEO fields, canonical generation and sitemap. Check for an existing slug/document before adding it.

The section exposes introductory copy, editable question/help text, submission/success copy and an ordered `reasons` array. Each reason has a stable identifier, label, optional message prompt/helper text and an enabled switch. Owners can add, edit, reorder and disable reasons without code. Validate unique identifiers and at least one enabled reason. Avoid building a general-purpose form builder or exposing validation/security controls to the owner.

Validate submissions against the current published form and enabled reasons on the server; never trust a label or recipient supplied by the browser. If an owner changes options while someone fills the form, retain their answers and ask them to update the selection. Define predictable content refresh behavior for published changes.

Add Kontakt through the existing Header/Footer navigation editors. Offer a contextual “Catering anfragen” link from suitable existing content, pointing to `/kontakt?anliegen=catering`; preselection must use a valid stable reason identifier and remain editable. Keep all ordering links on `/order`. No names, email addresses or messages belong in URLs.

## Email delivery and reliability

Recommended integration: a Next.js `POST /api/contact` route with **Resend** for transactional email. The page can keep its static rendering; only submission runs on the server. Next.js supports POST route handlers, and Resend documents this integration. [Next.js route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route), [Resend with Next.js](https://resend.com/docs/send-with-nextjs).

Send to the fixed server-configured recipient `hello@tapparo.com`. Use a verified Tapparo sender, for example `website@notify.tapparo.com`, and put the visitor’s validated email in Reply-To so the owner can reply normally. Use a clear subject such as “Website-Anfrage · Catering anfragen”, with the reason, name, email, full message and a reference in the body. Include plain text and escaped HTML. Domain verification and provider DNS records are required; preserve the existing mailbox configuration. [Resend domains](https://resend.com/docs/dashboard/domains/introduction), [email API](https://resend.com/docs/api-reference/emails/send-email).

Disable repeat clicks while sending and use a stable submission identifier for safe retries. Resend supports duplicate prevention with idempotency keys for 24 hours. Keep the same payload/key during a retry; editing a submitted payload creates a new attempt. Refresh the single-use spam token when needed. Show success only after the provider accepts the email; provider acceptance is not a guarantee of inbox delivery. [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).

Use provider delivery/bounce visibility and minimal request IDs/status logging to troubleshoot. Avoid logging message bodies or email addresses. Keep typed answers in page memory during errors. No lead database or visitor autoresponder is included initially; the owner inbox and provider delivery records are the initial workflow. Test actual inbox delivery and Reply-To before launch.

## Spam protection

Aim for strong spam resistance; no public form can be guaranteed spam-proof.

- Use **Cloudflare Turnstile** in managed mode near final submission, validating every token on the server and checking the expected hostname/action. Tokens expire after five minutes and are single-use, so handle expiry and retries without clearing answers. Turnstile has a free plan for business use and does not require moving the website to Cloudflare. [Validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [plans](https://developers.cloudflare.com/turnstile/plans/).
- Add a honeypot that is excluded from keyboard/screen-reader navigation and normal autofill. Treat unusual completion speed as a supporting signal, not the sole reason to reject a person using autocomplete.
- Use shared server-side rate limits, proposed via **Upstash Redis**, per trusted client IP and with a global sending ceiling. An in-memory counter is insufficient across serverless instances. Tune conservative limits without locking out normal visitors on a shared connection; use short-lived hashed identifiers. [Upstash rate limiting](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview).
- Enforce field types/lengths, a small request-size limit, an enabled CMS reason, expected request origin and fixed recipients. Reject header injection, escape user text and accept no attachments in version one. Origin checking supplements the other protections; it does not replace them.
- If verification or the rate-limit service is unavailable, retain the draft and offer retry/direct email. Do not silently disable protection or claim an unsent request succeeded.

## Setup and data handling

Confirm the destination mailbox, sender domain/DNS access, provider accounts, current quotas and expected costs before live integration. Store email, Turnstile and rate-limit secrets only in server environment variables. Use separate development/preview settings with mocked delivery or a designated test inbox; never let ordinary preview submissions email the owner.

Use Sanity for public form configuration only. Do not store visitor submissions in the public content dataset or browser persistent storage. Add a brief processing explanation and link to the existing privacy text near submission. Review the actual email/challenge/rate-limit providers, retention settings and any necessary privacy-text additions before release. Keep enquiry processing separate from any later marketing opt-in; do not silently subscribe visitors.

Hosting prerequisite: Vercel’s published Hobby terms limit that plan to personal/non-commercial use. Confirm an appropriate business hosting plan before releasing this restaurant enquiry feature. This does not prevent building/reviewing it locally; no plan changes are authorized here. [Vercel Hobby](https://vercel.com/docs/plans/hobby).

## Implementation sequence and review points

| Phase | Work | Reviewable result |
| --- | --- | --- |
| 7.1.1 Flow and design | Finalize German copy, reason-first flow and desktop/mobile states. Prototype with local fixture data and mocked sending. | Complete form, review, success/error and reduced-motion states, visually matched to Tapparo. |
| 7.1.2 CMS integration | Add the reusable section and validation, development Kontakt page, projections and navigation references. Preserve unrelated documents/drafts. | Owner can manage reasons and copy; route, metadata and links work. |
| 7.1.3 Submission and protection | Build server validation, Turnstile, shared limits, idempotent email delivery and recoverable errors. Configure test credentials only. | Tested endpoint and a readable sample email; no live visitor traffic. |
| 7.1.4 Conversion and accessibility | Add the catering entry link/preselection, check progress/back/edit flows, focus, keyboard and mobile keyboard behavior. | A short usable journey from catering CTA to submission; no dead ends. |
| 7.1.5 Verification and owner handover | Check content refresh, disabled/missing reasons, duplicate submits, slow/offline/error cases, malicious input, challenge expiry, rate limits, screen readers, reduced motion, mobile/desktop/ultrawide layouts and type/build/regression checks. Document editing and delivery troubleshooting. | Ready for user review, with evidence and remaining setup requirements recorded. |
| 7.1.6 Lock-in and release preparation | Make sensible commits only after lock-in. Verify recipient/DNS, actual delivery, provider limits and privacy copy; prepare targeted production content changes and navigation updates. | Approved release package for milestone 8; no automatic production rollout. |

Suggested commit boundaries after approval: CMS configuration; form interface/accessibility; protected delivery and tests; documentation and verification. Combine tightly coupled changes where a split would leave the application broken.

## Acceptance criteria

- A visitor can submit the four requested inputs without unnecessary fields or losing answers on back/error.
- The owner can change enquiry options and copy through Sanity and reply directly from the received email.
- Catering is easy to find and prompts useful details without making them prerequisites.
- Submission errors, retries and duplicate prevention are truthful and recoverable; spam defenses run on the server.
- The page fits the existing visual system and remains usable with keyboard, screen reader, reduced motion and small viewports.
- All existing content, routes, menu prices, stories, legal wording and ordering behavior are preserved except explicitly reviewed additions.
- No production mutations or implementation commits occur before the corresponding approval.
