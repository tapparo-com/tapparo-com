# Kontakt: implementation and owner guide

Updated: 4 November 2026. The current milestone 7.1 implementation is locked in and committed as `020362b` (CMS configuration), `f164b8f` (protected delivery/tests), and `f5023df` (guided form/catering entry). Live delivery, provider setup and release verification remain pending in the [remaining activation checklist](contact-page-plan.md#remaining-activation-checklist).

Previous milestone commits: `be135f0` (stories/legal), `91aeba5` (menu and centered allergens), `62063a9` (completion record and approved Kontakt plan). No push, deployment or production content changes were made.

## Review the experience

- Open [Kontakt locally](http://localhost:3000/kontakt).
- Choose an enquiry reason, enter a name and email, then write a message. Catering has a tailored prompt for date, location and guest count without extra required fields.
- Review and edit the answers before sending. Back, menu opening and submission errors preserve the answers in page memory.
- The local **Formularvorschau** banner and confirmation explicitly state that no email is sent. Preview success exercises the real endpoint and current published CMS configuration, but does not contact email, challenge or rate-limit providers.
- The homepage product link **catering anfragen** opens `/kontakt?anliegen=catering`. The selection remains editable. Invalid identifiers do not preselect anything.

The form uses the existing page title, fonts, colors, header/footer and animated underline buttons. Questions transition with a short fade/lift; reduced motion removes the movement. Only the active question is focusable. Errors are announced, step headings receive focus, Enter advances single-line fields, and Enter creates a new line in the message. A direct email link remains available, including without JavaScript or when the form is disabled.

## Owner editing in Sanity

Open **Pages → Kontakt → Contact Form** in the local `/studio` (development dataset).

| Field | Behavior |
| --- | --- |
| Introduction | Short text above the first question. |
| Enquiry reasons | Add, reorder, rename or disable reasons. Keep at least one enabled. |
| Reason → Link identifier | Unique lowercase identifier, such as `catering`. Keep it stable after sharing links that use it. |
| Reason → Message question/help | Optional question and guidance specific to that reason. Otherwise the general message copy is used. |
| Questions and help text | Name/email/message prompts and supporting text. Blank optional copy falls back to the German defaults. |
| Submission and confirmation | Send label and the real-delivery success heading/message. Preview confirmation is intentionally fixed and clearly marked. |
| Privacy information | Reference to the legal page containing the privacy notice; required for an active form. |

The recipient, spam controls and input limits stay in code/server configuration. This is a reusable enquiry section, not a general form builder. Use one Contact Form section per enquiry page.

Edit navigation under **Navigation → Header / Footer**. The product entry link lives under **Pages → Home → Das Produkt (Text + Images) → Enquiry link (optional)**: label, Kontakt page reference and optional reason identifier. Removing this optional object removes the product link. Ordering artwork still leads to `/order`.

Published page content follows the site's existing 60-second ISR window: the next request after the window triggers regeneration and a following request sees the change. Already-open forms retain their displayed copy. Every submission reads the latest published section directly from Sanity, without CDN or page-cache reuse. If an owner disables/removes the selected reason, the response supplies the current choices and asks the visitor to choose again, retaining name, email and message. If the form or privacy reference is removed, sending stops and the direct email fallback remains available.

## Delivery and protection

`POST /api/contact` is a Node route handler; the page itself remains statically rendered/revalidated. The handler checks origin, JSON type/shape, a 32 KiB streamed body limit, field lengths, header/control characters, the honeypot and the current CMS reason. Name, email and message are required, with limits of 120, 254 and 5,000 characters respectively. Attachments are not accepted.

Live requests also require:

1. A shared Upstash sliding limit of eight attempts per visitor per ten minutes. Vercel's trusted client-IP header is HMAC-hashed with a daily rotation; raw IPs are not stored in Redis by this implementation.
2. A server-verified Turnstile token with the expected hostname and `contact` action. Expiry, widget errors and request retries obtain a fresh token without discarding answers.
3. A shared global ceiling of 80 verified sending attempts per day. Failures and retries may consume this ceiling; it is deliberately conservative and should be reviewed against actual provider quotas and traffic.
4. Resend acceptance of the email. A rate-limit outage or timeout fails closed; it never bypasses the protection.

Recipient is fixed to `hello@tapparo.com`. `CONTACT_FROM` supplies a verified Tapparo sender; the validated visitor email is Reply-To. The email contains the CMS reason label, name, email, complete message and reference in plain text and escaped HTML. Success means provider acceptance, not guaranteed arrival in the inbox. There is no visitor autoresponder, newsletter signup or lead database.

Repeat clicks are disabled. The browser retains a UUID for an unchanged payload across retries; editing the payload creates a new UUID. A short-lived Redis record freezes the CMS reason label, HMAC payload fingerprint and delivery status, keeping Resend's idempotency payload stable even after an owner edits the label. Records expire after 48 hours. Unresolved retries older than 23 hours are refused rather than risk exceeding Resend's 24-hour idempotency window. Duplicate protection is bounded by these retention windows, not permanent storage.

Answers remain only in page memory until submission/refresh/navigation. No personal enquiries are written into Sanity or persistent browser storage. App logs contain only an accepted submission reference or a generic service-failure message. Email providers receive the enquiry content; Turnstile and the host have their own processing/retention policies. Those settings and privacy disclosures still need release review.

## Environment and provider setup

Use [.env.contact.example](../.env.contact.example) as the variable checklist. Only the Turnstile site key is public. Never place the Resend key, Turnstile secret, Redis token or HMAC secret behind a `NEXT_PUBLIC_` prefix.

| Mode | Requirements and behavior |
| --- | --- |
| `demo` | Development dataset, not a Vercel production deployment. Local `next dev` defaults to this if no mode is specified. A production-style review build needs the explicit `demo` value. Validates and confirms a clearly labeled preview; sends nothing. |
| `disabled` | Default for other environments and incomplete live configuration. Shows the email fallback; POST returns an unavailable response. |
| `live` | Explicit `CONTACT_DELIVERY_MODE=live`, Vercel production environment, production dataset, and all provider variables. Ordinary previews cannot send to the owner. |

**A controlled test-delivery mode still needs implementation.** These are the only three modes currently supported. Before real-provider testing, add an explicitly enabled development mode with a fixed test inbox, environment-specific origin/IP handling and isolated rate-limit/idempotency records. Adding credentials alone does not enable sending in development. The [activation checklist](contact-page-plan.md#remaining-activation-checklist) tracks this code work, service setup, verification and release in order.

Before live release:

1. Set up Resend and verify a Tapparo sending domain/subdomain. Choose `CONTACT_FROM`, for example `Tapparo <website@notify.tapparo.com>`, after DNS verification. Preserve existing mailbox records. Confirm the owner's receiving mailbox and delivery/bounce visibility.
2. Set up a managed Turnstile widget for the canonical public hostname. Set its public site key and private secret separately. The handler expects the origin/hostname from `NEXT_PUBLIC_SITE_URL`; aliases should redirect to that canonical host.
3. Configure Upstash Redis with an appropriate region/retention arrangement. Set its REST URL/token and a random HMAC secret of at least 32 bytes. Review provider quotas, costs, privacy terms and the business hosting prerequisite recorded in the plan.
4. Keep ordinary previews in demo/disabled mode. Implement and configure the controlled test mode above, then complete a real email test with the development dataset and agreed test inbox before accepting visitor traffic. Check inbox arrival, spam folder placement, Reply-To, retry behavior and provider logs. No such test has been sent in this implementation pass.
5. Review the privacy notice for the actual selected services. The current development form references the existing Impressum/privacy page; its legal wording has not been changed.
6. Confirm environment settings at build time as well as runtime. Redeploy when mode/site key changes because the form page is statically generated. To disable an existing live endpoint immediately, change the server mode; refresh/rebuild the page so it also displays the fallback.

If a visitor reports a failure, use the reference and provider delivery status to investigate. A success may have reached the email provider even if the browser timed out; an unchanged retry uses the same idempotency key. If Redis or Turnstile fails, restore the service rather than remove protection. Do not paste message bodies or credentials into logs.

## Development content changes and release boundaries

Changes were limited to project `64kcdhuf`, dataset `development`:

- Created published development page `rmrWCUj4Zl318b4kDFBbDa` at `/kontakt`, with section key `contact`, three starter reasons and the existing privacy-page reference.
- Appended Kontakt to `navigationHeader`, `navigationFooter` and the existing `drafts.navigationHeader`. Original navigation fields/entries were compared and preserved; the existing draft was not published or discarded.
- Added only `contactAction` to the existing product section on home page `f803c306-580e-4053-9b34-84d9cda1f91a`. Existing homepage text, images, order and other fields were compared and preserved.
- All 141 unrelated content document/draft revisions are unchanged; the dataset now has 146 content documents/drafts. Stories, menu data, legal wording and all ordering destinations are unchanged.

The local Studio schema is authoritative. A remote MCP schema was stale and did not describe the existing section-based page model, so content creation used the authenticated local CLI instead. No managed schema or hosted Studio was deployed.

`scripts/seed-contact.ts` is development-only and defaults to a dry run:

```bash
npx sanity exec scripts/seed-contact.ts --with-user-token
# Apply only when the dry run is reviewed:
npx sanity exec scripts/seed-contact.ts --with-user-token -- --apply
```

The script checks route conflicts, creates the page if missing, adds missing navigation links with revision guards and verifies preservation. It does not seed the optional homepage product action, which was added separately with a guarded content comparison. Stop and inspect conflicting Kontakt drafts rather than replacing them.

Production release requires fresh backups and a targeted plan: deploy the compatible local schema/application, create/reference the production Kontakt page and privacy document, append approved navigation links while preserving owner drafts, and add the product action using the new production reference. Do not copy the development dataset over production or reuse development document IDs blindly. Prepare rollback by disabling delivery and removing only the new references/fields after checking intervening edits.

## Verification evidence

Evidence is kept locally in gitignored `.sanity-backups/contact/`. The pre-commit run reconfirmed all 32 tests, TypeScript and a clean diff check; earlier schema/build/browser evidence is retained:

- All 32 tests pass, including ten new contact tests for validation, current CMS choices, demo isolation, service failures, token hostname/action, fixed recipient, escaped email content and idempotent retries through mocked SDK requests. No real emails were sent.
- TypeScript, schema extraction, the development slug audit and the isolated optimized build pass. `/kontakt` is statically generated and `/api/contact` is dynamic. The user's original development server and its `.next` build output were not used for the isolated build.
- Responsive browser checks pass at 320, 390, 768, 844, 1024, 1440, 2560 and 5092 px, including short landscape. No horizontal overflow; form width stays within 624 px.
- Full mobile/desktop journeys cover validation, Enter behavior, menu/answer preservation, review edits, failed-send recovery with a stable UUID, real demo-endpoint confirmation, query preselection, the product entry link and no-JavaScript email fallback.
- Isolated browser fixtures with a mocked Turnstile script verify missing/expired token blocking, challenge reset, updated CMS reasons with answer preservation, confirmation focus, blocked-script email fallback, missing privacy/disabled states and a 5,000-character unbroken message at 320 px. Normal motion and reduced motion both work without browser runtime errors. These fixtures never call live email services.
- Before/after data snapshots and a final revision comparison record the exact allowed changes above.

Real Turnstile service integration, DNS, real inbox/Reply-To delivery, physical mobile keyboards and assistive-technology testing remain release checks. Browser viewport and accessibility semantics checks do not substitute for those.
