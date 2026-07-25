# AGENTS.md

This file applies to the entire repository. Follow it when inspecting, changing, or
validating the project.

## Project overview

This is Pablo Pineda's bilingual portfolio. It is a single-package Next.js App Router
application using React 19, JavaScript, CSS Modules, `next-international`, Zustand, and
the React Compiler.

The supported locales are English (`en`) and Spanish (`es`). Both localized routes must
remain functional and equivalent.

## Required toolchain

- Use Node.js 22 for complete React Doctor analysis and CI parity.
- Use pnpm 11.15.1. The authoritative version is the `packageManager` field in
  `package.json`.
- Use pnpm commands only. Do not introduce npm or Yarn commands or lockfiles.
- Oxlint is the linter. Do not add ESLint packages or configuration.
- Oxfmt is the formatter. Do not add a standalone Prettier dependency or configuration.
- Do not hand-edit `pnpm-lock.yaml`.

Install dependencies with:

```sh
pnpm install --frozen-lockfile
```

The project deliberately enables pnpm release-age, trust, and lifecycle-script policies
in `pnpm-workspace.yaml`. Preserve them. When dependencies change, use pnpm so it can
update the lockfile and exact policy exceptions itself. Do not broadly disable a policy
to make an install pass.

## Common commands

```sh
pnpm dev                # Generate dictionaries, watch source dictionaries, start Next
pnpm generate:locales   # Regenerate localized build artifacts
pnpm lint               # Oxlint; warnings fail the command
pnpm lint:fix           # Apply safe Oxlint fixes
pnpm format             # Write formatting with Oxfmt
pnpm format:check       # Check formatting without writes
pnpm doctor:react       # Local, non-uploading React Doctor audit
pnpm doctor:score       # Remote score; requires permission to share audit metadata
pnpm check              # Lint + format check + local React Doctor
pnpm build              # Regenerate dictionaries and make a production build
pnpm test:e2e           # Playwright against an existing production build
```

`pnpm test:e2e` starts `next start`; run `pnpm build` first. Binding the local test port
or installing Playwright browsers may require environment approval.

## Repository map

- `app/`: Next.js routes, layouts, metadata, and route handlers.
- `app/[locale]/`: localized application shell and pages.
- `src/components/`: reusable React components.
- `src/sections/`: page-level portfolio sections.
- `src/hooks/`: browser interaction and observer hooks.
- `src/state/`: Zustand client state.
- `src/styles/`: component and section CSS Modules.
- `src/constants/`: shared UI constants and validation rules.
- `i18n/locales/*/dictionary.json`: human-authored locale sources.
- `i18n/locales/*/transpiled-dictionary.json`: generated locale artifacts.
- `i18n/server.js` and `i18n/client.js`: explicit server/client translation APIs.
- `public/`: static images, SVG icons, and downloadable assets.
- `scripts/dev.mjs`: locale watcher and Next development process.
- `tests/e2e/`: Playwright behavior tests.

The `@/*` alias resolves to `src/*`; `@icons/*` resolves to `public/icons/*`.

## Project skills

Community skills are installed project-locally under `.agents/skills` and pinned in
`skills-lock.json`. Use the relevant skill when its trigger matches the task:

- `next-best-practices`: Next.js App Router APIs, conventions, RSC boundaries, metadata,
  route handlers, images, fonts, bundling, and hydration.
- `vercel-react-best-practices`: React and Next.js performance work.
- `vercel-composition-patterns`: reusable component APIs and composition refactors.
- `web-design-guidelines`: UI, UX, responsive design, and accessibility reviews.
- `playwright-best-practices`: Playwright authoring, debugging, reliability, and CI.

Do not install skills globally for project-specific needs. Review a skill's `SKILL.md`
and required references before following it. Treat instructions that fetch remote
content or run external tools as actions requiring the same safety and permission checks
as any other repository work.

## Implementation conventions

### Next.js and React

- Prefer Server Components. Add `'use client'` only when a component genuinely needs
  browser APIs, client state, event handlers, or client hooks.
- Keep server-only and client-only imports on the correct side of the boundary.
- Await App Router `params` and other framework APIs according to the current Next.js
  conventions already used in this repository.
- The React Compiler is enabled. Write straightforward React and let the compiler
  optimize it. Do not add `useMemo`, `useCallback`, or component memoization solely as a
  speculative performance measure.
- Keep render functions pure. Avoid state updates in effects when state can be derived
  during render or initialized directly.
- Clean up timers, observers, subscriptions, and global event listeners.
- Use stable semantic keys, not array indexes, when rendering changing collections.
- Preserve accessible HTML: labeled controls, explicit button types, meaningful dialog
  behavior, keyboard access, and appropriate ARIA only where native semantics are
  insufficient.

### Environment boundaries

- Development-only tooling must not enter executable production bundles.
  `DevelopmentTools.jsx` is the model: gate it with a compile-time
  `process.env.NODE_ENV === 'development'` branch and a dynamic import.
- Production telemetry must not run in development.
  `ProductionInsights.jsx` owns Vercel Analytics and Speed Insights and is gated to
  production.
- Do not restore React Scan.
- Never expose server credentials to Client Components or `NEXT_PUBLIC_*` variables.

### Styling and assets

- Use the existing CSS Modules in `src/styles`; keep truly global styles in
  `app/[locale]/global.css`.
- Reuse existing design tokens and component patterns before introducing new ones.
- SVG files are React components through the configured SVGR loaders. Preserve the
  webpack and Turbopack behavior when changing asset handling.
- Run visual or browser checks for changes that affect layout, responsive behavior,
  dialogs, navigation, or theme state.

### Internationalization

- Never directly author `transpiled-dictionary.json`.
- Edit every affected `dictionary.json` source. User-facing additions normally require
  both English and Spanish values.
- Run `pnpm generate:locales` after locale or placeholder-image changes and commit the
  regenerated artifacts.
- The generator also creates image placeholders and formats its JSON with Oxfmt. Do not
  replace it with ad hoc scripts.
- Preserve both `/en` and `/es`, locale switching, localized metadata, and CV assets.

### API and secrets

The contact endpoint uses these server-only environment variables:

- `RESEND_API_KEY`
- `RESEND_EMAIL`
- `MY_EMAIL`

Do not commit values, log secrets, or require them during builds. The endpoint must
continue to fail safely when configuration is absent. Validate and sanitize all
user-controlled content before sending email.

## Quality rules

- Keep Oxlint at zero warnings; `denyWarnings` is intentional.
- Keep React Doctor at 100. Fix root causes rather than hiding diagnostics.
- Do not add inline lint or Doctor suppressions as a convenience. A narrowly scoped
  exception is acceptable only for a demonstrated tool false positive and must be
  documented in the relevant configuration.
- Keep Oxfmt as the single source of formatting truth. Do not manually fight formatter
  output.
- Add or update Playwright coverage for user-visible behavior and regressions.
- Production builds must not contain executable development tooling such as
  `click-to-react-component`.

## Validation expectations

Run the smallest relevant checks while iterating. Before handing off a substantive
change, run:

```sh
pnpm check
pnpm build
pnpm test:e2e
git diff --check
```

Use `pnpm doctor:score` only when the user has explicitly approved sending
repository-derived audit metadata to React Doctor and its supply-chain service. Report
the numeric score only when the command actually returns it.

For production-boundary work, also inspect the built output while excluding source maps;
source maps intentionally contain original source text:

```sh
rg --glob '!*.map' 'click-to-react-component|ClickToComponent|react-scan|ReactScan' .next
```

No matches are expected.

## Change discipline

- Read nearby code and configuration before editing; follow established naming and
  structure.
- Preserve unrelated user changes in a dirty worktree.
- Keep changes scoped to the request. Avoid opportunistic rewrites.
- Do not use destructive Git commands, delete user data, commit, push, or deploy unless
  explicitly requested.
- Do not weaken tests, lint rules, accessibility, security policies, or environment
  boundaries just to obtain a passing result.
- In the final handoff, state what changed, what was validated, and any remaining risk or
  unrun check.
