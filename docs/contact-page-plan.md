# Contact page: remaining setup

The guided form and CMS fields are implemented. Email delivery is not implemented and no provider has been selected. This is the only open implementation plan; repository conventions and manual production migration live in [AGENTS.md](../AGENTS.md).

## Current behavior

The form asks for reason → name → email → message → review. Back/edit and recoverable errors preserve answers in page memory. Answers are not stored in Sanity or persistent browser storage.

- **Demo:** available with the development dataset outside Vercel production. Local `next dev` defaults to it; set `CONTACT_DELIVERY_MODE=demo` for optimized development builds. The confirmation explicitly says no email was sent.
- **Disabled:** all other environments, including production. Visitors receive a direct-email link. There is no live mode or provider configuration yet.
- `POST /api/contact` validates the origin, JSON shape, 32 KiB body limit, honeypot, current published CMS reasons and required fields. It returns a demo confirmation only; it cannot send mail.
- Missing form/privacy configuration disables the form. Changed reasons are returned to the visitor without losing their other answers. Without JavaScript, direct email remains available.

## Editing

Open **Pages → Kontakt → Contact Form**. Edit introduction, prompts/help, reason labels/order and privacy-page reference. Keep 1–8 reasons with at least one enabled. Stable reason identifiers such as `catering` support `/kontakt?anliegen=catering`; unknown or disabled identifiers do not preselect anything.

The parent page controls the heading. Prompt changes do not change the required fields or step order. Confirmation fields are retained in the schema for future delivery; the demo uses fixed no-email copy.

The optional **Text + Images → Enquiry link** needs a published Kontakt page reference and may include a reason identifier. Navigation entries are separate. Public email comes from **Site Settings → Contact → Email**, currently falling back to `hello@tapparo.de` in code. Confirm the intended receiving address before implementing delivery.

## Remaining work

- [ ] Confirm the receiving mailbox and choose a delivery service with the owner. No provider is assumed.
- [ ] Implement server-side delivery, sender/Reply-To handling and appropriate spam protection for that choice. Keep validation and preserve answers on failures; only show success after confirmed acceptance. Handle retries without duplicate messages.
- [ ] Add the chosen service's configuration instructions when it is implemented. Keep credentials on the server and development testing separate from the live inbox.
- [ ] Test real delivery with an agreed test inbox: complete message, sender, Reply-To, failures and retries. Add meaningful tests for the implemented behavior.
- [ ] Check mobile input, keyboard/focus, reduced motion and the owner's editing workflow. Review privacy wording for the services actually selected.
- [ ] Prepare production Kontakt/privacy/navigation references using the manual release notes in AGENTS.md. The user activates delivery only after setup and testing are complete.
