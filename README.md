# Habit Tracker

A personal health and habit tracker built as a PWA (Progressive Web App). Runs entirely on Netlify — no build step required. Stores data in Netlify Blobs. Opens full-screen on iPhone when added to the Home Screen.

## Features

- Daily habit check-ins (food, exercise, sleep, wellbeing)
- Meal and snack logging
- 7-day weekly summary
- AI-generated weekly review (via Claude API — optional)
- Apple Shortcuts bridge to pull real Apple Health data (optional)
- Works offline — local-first with cloud sync via Netlify Blobs

## Deploy

### One-click (Netlify Drop)
Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this folder onto the page.

### From this repo
1. Fork or clone this repo
2. In Netlify → **Add new site → Import an existing project**
3. Connect your GitHub repo
4. No build command needed — set publish directory to `.`

## Environment Variables

Set these in Netlify → **Site settings → Environment variables**.

| Variable | Required | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | Optional | Enables AI weekly reviews. Get one at [console.anthropic.com](https://console.anthropic.com) |
| `HEALTH_SECRET` | Optional | Shared secret for the Apple Shortcuts health bridge. Generate with `openssl rand -base64 32` |

## Add to iPhone Home Screen

1. Open your Netlify URL in Safari on iPhone
2. Tap **Share → Add to Home Screen**
3. Name it "Habits" → Add

The app opens full-screen with no browser chrome.

## Apple Shortcuts — Health Data Bridge (optional)

Lets the app show your real Apple Health activity data.

**Create the Shortcut:**
1. Open Shortcuts on iPhone → New Shortcut
2. Add these actions in order:
   - **Get Health Samples** → Active Energy Burned → Today → sum
   - **Get Health Samples** → Steps → Today → sum
   - **Get Health Samples** → Workout Minutes → Today → sum
   - **Get Contents of URL**
     - URL: `https://YOUR-SITE.netlify.app/api/health`
     - Method: POST
     - Request Body: JSON
     - Fields: `secret`, `minutes`, `steps`, `kcal`
3. Automate → New Automation → Time of Day → 9:00 PM → Run Shortcut

## File Structure

```
├── index.html                    ← Full app (React via CDN, no build step)
├── manifest.json                 ← PWA manifest
├── netlify.toml                  ← Netlify config
├── package.json                  ← @netlify/blobs dependency
├── icon-192.png                  ← App icon
├── icon-512.png                  ← App icon
├── docs/
│   ├── habits-library.md         ← 100 habits organised by time of day
│   └── health-habits-list.md     ← Research-backed habits with tracking format
└── netlify/
    └── functions/
        ├── habits.js             ← GET/POST today's habit state
        ├── log.js                ← Append meal/snack log entry
        ├── health.js             ← Apple Shortcuts bridge
        ├── weekly.js             ← 7-day data for weekly screen
        └── weekly-review.js      ← Claude AI weekly insight
```

All habit data is stored in **Netlify Blobs** — private to your site, no third-party database needed. The app also caches locally so it loads instantly and works offline.

## Tech Stack

- **Frontend:** Vanilla HTML + React (via CDN) — no build toolchain
- **Backend:** Netlify Functions (Node.js)
- **Storage:** Netlify Blobs
- **AI:** Anthropic Claude API (optional, for weekly reviews)
- **Hosting:** Netlify
