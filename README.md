# Pablo Pineda's portfolio

The source for [pablo.steralynx.com](https://pablo.steralynx.com), a personal
portfolio available in [English](https://pablo.steralynx.com/en) and
[Spanish](https://pablo.steralynx.com/es).

![Portfolio preview](./i18n/locales/en/splash.jpg)

Built with Next.js, React, TypeScript, and CSS Modules. The site combines a localized
portfolio with crawlable HTML résumés, project galleries, a skills overview, a contact
form, and a small set of interactions that make browsing it feel less static.

- Locale content comes from separate English and Spanish dictionaries, with localized
  metadata, HTML résumés, and PDF CV downloads for each route.
- Search discovery includes canonical and alternate-language URLs, JSON-LD profile
  data, a sitemap, crawler rules, and an AI-readable `llms.txt` summary.
- The project viewer is an accessible dialog: it supports Escape to close, arrow keys
  to move through images, and pan and zoom controls for a closer look.
- Theme preference is stored locally, and navigation follows the section currently in
  view.
- The contact endpoint validates and sanitizes form data on the server before sending
  email through SMTP.
- Playwright covers the two locale routes, switching languages, theme persistence, and
  closing the image viewer.

## Stack

Next.js App Router · React 19 · TypeScript · next-intl · Zustand ·
react-zoom-pan-pinch · Sharp · Vercel Analytics · Playwright

### Contact form

Email delivery is optional during local development. To enable it, provide these
server-side variables:

```sh
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
MY_EMAIL=
```

If they are not present, the email endpoint returns `503` without affecting the rest
of the site.

### Site URL

Canonical URLs, sitemap entries, structured data, the PDF résumé, and email signatures
use the server-side `SITE_URL` variable. It defaults to the production domain and can
be overridden for another deployment:

```sh
SITE_URL=https://pablo.steralynx.com
```

### Search Console

Google Search Console verification is optional. For an HTML-tag verification, set the
server-side token in the deployment environment and rebuild:

```sh
GOOGLE_SITE_VERIFICATION=
```

The verification metadata is omitted when the variable is not present.

## Useful commands

```sh
pnpm dev                # Start development and watch locale sources
pnpm check              # Type-check, lint, format, and run project audits
pnpm build              # Create a production build
pnpm test:e2e           # Run browser tests after building
```

## Editing content

Locale copy lives in `i18n/locales/en/dictionary.json` and
`i18n/locales/es/dictionary.json`. `next-intl` loads these message files directly.

## License

MIT
