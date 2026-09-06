@AGENTS.md

# Project: Dinesh's Portfolio

A single-page portfolio built around an animated, scripted "chat" experience inside a hero card. Read this file before making changes — it captures conventions established over the build so far.

## Tech stack

- **Next.js 16** (custom/canary build — see AGENTS.md above, App Router, Turbopack). React 19, TypeScript.
- **Tailwind CSS v4** — no `tailwind.config.js`; tokens are defined via `@theme inline` in `src/app/globals.css` (fonts, colors, radii). Arbitrary-value classes (`w-[700px]`, `text-[15px]`) are used freely to match Figma specs exactly rather than snapping to Tailwind's default scale.
- **shadcn/ui + radix-ui + lucide-react** are installed and scaffolded under `src/components/ui/` (button, card, dialog, avatar, badge, input, separator), but **none of the actual portfolio UI uses them**. Every component under `src/components/Hero/` is hand-built with raw Tailwind classes and plain HTML elements. Don't reach for the `ui/` primitives unless asked — match the existing hand-built style.
- **framer-motion** — use this for all *new* animation work going forward (decided 2026-09-05). Existing animations still run on plain CSS `@keyframes` (see below) and don't need to be migrated proactively, but anything new — entrances, hover/gesture effects, orchestrated sequences — should use framer-motion's `motion.*` components / `animate`/`variants` API instead of adding more raw keyframes.
- `class-variance-authority`, `clsx`, `tailwind-merge` back the `cn()` helper in `src/lib/utils.ts` — use `cn(...)` (not raw template strings) whenever a component's className needs to merge a caller-provided `className`/conditional classes with its own defaults.

## Project structure

- `src/app/` — App Router root (`layout.tsx`, `page.tsx`, `globals.css`). `page.tsx` is just a thin wrapper rendering `<Hero />`.
- `src/components/Hero/` — the whole app lives here right now: `Hero.tsx` (orchestrator), `CatMascot.tsx`, `AboutMeCard.tsx`, `GalleryModal.tsx`, `ProjectCard.tsx`, `ThemeToggle.tsx`.
- `src/components/Chat/` — currently empty (`.gitkeep` only); reserved for when the chat UI is extracted out of `Hero.tsx`.
- `src/components/ui/` — shadcn scaffolding, currently unused by the app (see above).
- `public/images/hero/` — hero-specific assets (background, profile photo, cat mascot SVG layers under `cat/`).
- `public/images/gallery/` — numbered gallery photos (`1.png`–`19.png`) for the "Happy gallery" modal masonry grid. Real personal photos live at `public/images/pic1.png` / `pic2.png` (used in the About-Me polaroid stack, not the gallery grid — they include a baked-in polaroid frame + "hi.." caption, so they crop badly as raw masonry tiles).
- `public/images/experience/`, `public/images/projects/` — currently empty, reserved for future sections.

## Design tokens (`globals.css`)

- Fonts: `font-sans` (Geist, default UI), `font-body` (Inter — most body/paragraph text), `font-script` (Satisfy — cursive headline accents like "Hey, I'm Dinesh"), `font-manrope` (stat labels), `font-mono` (Geist Mono).
- Radii: `--radius-sm/md/lg/xl/2xl/3xl/4xl` scale off a single `--radius` base — prefer these over ad hoc `rounded-[Npx]` when a value roughly matches the scale, though most components here use explicit `rounded-[20px]`/`rounded-[16px]` etc. to match Figma pixel-for-pixel.
- Dark mode: `.dark` class on `<html>`, toggled by `ThemeToggle.tsx` via `localStorage` + `prefers-color-scheme`. Most Hero components are **not** dark-mode aware yet (built against the light design only) — check before assuming `dark:` variants exist.

## Animation conventions

**New animation work uses framer-motion** (see Tech stack above). The animations built before 2026-09-05 predate that decision and still run on plain CSS `@keyframes` defined in `globals.css`, applied via inline `style={{ animation: "..." }}` — leave these as-is unless a task specifically calls for touching them. Existing keyframe catalog: `tail-wag`, `cat-drift`, `cat-bob`, `paw-wave`, `eye-blink`, `tooltip-pop`, `card-pop-in`, `clarity-reveal` (blur+scale+opacity entrance), `chat-row-in`, `typing-bounce`, `shimmer-sweep`.

**Gotcha — transform + `position: fixed`:** an element with an active/completed CSS `animation` or `transition` that sets `transform` (even an identity value like `translateY(0)`) creates a new containing block, so any `position: fixed` descendant will anchor to *that* element instead of the viewport. This bit us with `GalleryModal` rendering inside an animated `AboutMeCard` — the fix was `createPortal(..., document.body)` so the modal always escapes ancestor transforms. Reach for a portal any time a fixed-position overlay needs to live inside a component that has (or might get) an entrance animation.

**Gotcha — react-hooks/set-state-in-effect lint rule:** this repo's lint config flags any synchronous `setState` call directly in a `useEffect` body. Prefer deriving the value in render, using the `useState` initializer, or moving the `setState` into an event handler / async callback instead of adding `eslint-disable` comments.

## Component conventions

- Components that need an externally-driven entrance/exit animation accept a `style?: React.CSSProperties` prop and merge it onto their root element (e.g. `CatMascot`, `ThemeToggle`, `AboutMeCard`) so the parent (`Hero.tsx`) can drive `animation`/positioning per-instance.
- When a component's own continuous animation (e.g. `CatMascot`'s idle drift) would conflict with a caller-supplied entrance animation on the same element (both touch `transform`), split them onto nested elements — outer div owns positioning/entrance, inner div owns the continuous animation. Two CSS animations on the same element targeting the same property don't blend; the later one in the cascade wins outright.
- Image/asset fallbacks: components that reference not-yet-uploaded assets (e.g. `GalleryModal`'s masonry tiles) use a plain `<img onError={...}>` with local `failed` state to swap in a neutral "Add photo" placeholder, rather than letting a 404 show a broken-image icon.
- Large user-uploaded images get resized with `sips -Z <maxDimension>` before committing (macOS built-in, no extra deps) — check `sips -g pixelWidth -g pixelHeight` first; several uploads this session were 5-10MB / absurdly-tall (one was 5760×26404px) and needed downscaling before use in `next/image`.

## Figma workflow

- This project has a Figma MCP connection (file key `GXeB2EdGkM4Tx9m3k3F878`). It requires periodic re-authorization — when `get_design_context` errors with "requires re-authorization", tell the user to run `/mcp` (or `claude mcp`) in an interactive terminal session to reconnect; it cannot be fixed from a non-interactive session.
- Always use the `figma-design-to-code` skill's workflow: `get_design_context` on the target node, treat the returned code as reference only, and adapt it to this project's existing Tailwind/component conventions (not the raw generated markup).
- Figma's generated stock-photo/placeholder content (e.g. a "@tomklaus" Instagram handle, generic "Happy gallery" stock photos) should be treated as layout reference, not real content — check with the user before assuming placeholder text/handles should ship as-is.
- Figma asset URLs from `get_design_context` expire after ~7 days — for anything committed, download and resize the asset into `public/` rather than linking the temporary URL.

## Verification workflow

After every code change: run `npx tsc --noEmit` and `npx eslint <changed files>` (from the project root — `cd`-ing into a subdirectory earlier in the session breaks eslint's file-pattern matching) before considering a task done. This project also has an `.impeccable/config.json` design-quality hook that scans edited files post-write/post-edit; treat its findings as signal, not noise, but narrow suppressions (`ignore-value`) are reasonable for genuine false positives — see the two existing entries in that file for the reasoning style expected.
