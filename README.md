# Stress Lab

Public demo for **THEWHATIF.COMPANY**. Paste or describe a UI — a members list, profile form, billing table, or support inbox — and the app invents worst-case data: very long names, unusual emails, edge-case labels, emoji, RTL, CJK, and lists that should never have shipped in the screenshot.

Inspired by [Emil Kowalski’s “ask it to break the stuff I built” demo](https://x.com/emilkowalski/status/2103516287452483885). Toggle **Demo data** / **Worst case** on a live preview and watch the layout hold or fold.

## What it does

- **Prompt or presets** — describe a UI, or pick Members, Profile, Billing, or Inbox.
- **Local “AI” composer** — no API key. The browser parses the prompt, picks a surface, and generates a stress pack (Chaos is the Emil-level default).
- **Live preview** — the same card with happy-path copy, then the catastrophic version: wrapping Polish compound names, an email used as a display name, a one-letter “Jo”, expired-invitation pills, RTL senders, emoji initials.
- **What breaks** — notes plus optional overflow outlines on names, labels, and cells that overflow their box.
- **Copy JSON** — take the pack into your own mock.

Intensity:

| Level | Mood |
| --- | --- |
| Calm | A few long names. Still polite. |
| Chaos | 1,284 records, overflowing labels, tiny values next to giant ones. |
| Catastrophe | Adds RTL, CJK, emoji, and unbroken strings. |

## Run locally

Requires Node 22+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production bundle in dist/
npm run preview  # serve the built app
npm run lint
```

## Deploy to Cloudflare Pages

This is a static Vite SPA. After `npm run build`, `dist/` is the upload directory.

### Option A — Wrangler (direct upload)

```bash
npx wrangler login
npm run pages
```

That runs:

```bash
npm run build
npx wrangler pages deploy dist --project-name stress-test-ui --branch main --commit-dirty=true
```

First time only, create the project:

```bash
npx wrangler pages project create stress-test-ui --production-branch main
```

CI / non-interactive:

```bash
CLOUDFLARE_ACCOUNT_ID=<account-id> \
CLOUDFLARE_API_TOKEN=<pages-edit-token> \
npx wrangler pages deploy dist --project-name stress-test-ui --branch main
```

Create the token in the Cloudflare dashboard under **API Tokens** with **Account → Cloudflare Pages → Edit**. Do not commit tokens.

### Option B — Workers static assets

`wrangler.jsonc` points `assets.directory` at `./dist` with SPA fallback:

```bash
npm run deploy
# npm run build && npx wrangler deploy
```

Unauthenticated agent preview (lives ~60 minutes, prints a claim URL):

```bash
npm run build
npx wrangler deploy --temporary
```

### Option C — GitHub connected to Pages

1. Push this repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select `stress-test-ui`.
4. Build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Production branch:** `main`
5. Save and deploy. Preview URLs come from later commits on the production branch.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4.

All stress data is generated client-side. There are no secrets to configure.
