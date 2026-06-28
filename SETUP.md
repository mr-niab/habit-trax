# Habit Tracker — Setup Guide

The app opens straight to your dashboard — there is no passcode or login.

## 1. Deploy to Netlify

Easiest: go to https://app.netlify.com/drop and drag the `habit-tracker-deploy.zip`
file (or this whole folder) onto the page.

Or, if connecting a repo:
1. Push this folder to a GitHub repo
2. In Netlify, create a new site from that repo (no build command needed; publish dir is `.`)

## 2. Environment Variables

None are required to run the app. The two below are optional add-ons.

| Variable | Value | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Optional — enables AI weekly reviews. Get one at console.anthropic.com |
| `HEALTH_SECRET` | _(random string)_ | Optional — shared secret for the Apple Shortcuts health bridge. Generate with `openssl rand -base64 32` |

Set them in Netlify: Site settings → Environment variables.

## 3. Add to iPhone Home Screen

1. Open your Netlify URL in Safari on iPhone
2. Tap the Share button → **Add to Home Screen**
3. Name it "Habits" → Add
4. The app now opens full-screen with no browser chrome

## 4. Apple Shortcuts — Health Data Bridge (optional)

This lets the app show your real Apple Health activity data.

**Create the Shortcut:**
1. Open Shortcuts on iPhone
2. New Shortcut → add these actions in order:
   - **Get Health Samples** → Active Energy Burned → Today → sum
   - **Get Health Samples** → Steps → Today → sum
   - **Get Health Samples** → Workout Minutes → Today → sum
   - **Get Contents of URL**:
     - URL: `https://YOUR-SITE.netlify.app/api/health`
     - Method: POST
     - Request Body: JSON
     - Fields:
       - `secret` = _(your HEALTH_SECRET value, if you set one)_
       - `minutes` = Workout Minutes result
       - `steps` = Steps result
       - `kcal` = Active Energy result
3. **Automate** → New Automation → Time of Day → 9:00 PM → Run Shortcut

## 5. File Structure

```
├── index.html                    ← Full app (React via CDN, no build step)
├── manifest.json                 ← PWA manifest
├── netlify.toml                  ← Netlify config
├── package.json                  ← @netlify/blobs dependency
├── netlify/
│   └── functions/
│       ├── habits.js            ← GET/POST today's habit state
│       ├── log.js               ← Append meal/snack log entry
│       ├── health.js            ← Apple Shortcuts bridge
│       ├── weekly.js            ← 7-day data for weekly screen
│       └── weekly-review.js     ← Claude AI weekly insight
```

All habit data is stored in **Netlify Blobs** — private to your site, no third-party database needed.
The app also keeps a local copy in your browser, so it works offline and loads instantly.
