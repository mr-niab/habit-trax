# Personal Health & Habit Tracker — Planning Summary

**Stage:** Discovery / planning (pre-build)

## The Goal
A personal-use habit and health tracker that:
- Logs eating habits, exercise habits, and snack habits
- Surfaces a weekly summary of those habits
- Gives advice on what the habits mean for health and weight-loss goals
- Feels like a native app on iPhone
- Is private, behind a passcode

## Options Considered

### 1. Native Swift app (Xcode + CloudKit + HealthKit)
- ✅ True native UI, true iCloud sync, direct Apple Health access
- ❌ Requires a Mac + Xcode (access unconfirmed)
- ❌ Free Apple ID installs expire every 7 days unless upgraded to the $99/yr Apple Developer Program

### 2. PWA hosted on Netlify or Replit ("Add to Home Screen")
- ✅ Fast to build with existing React/web skills; real passcode protection is achievable on both platforms
- ❌ No true iCloud storage — data lives on the hosting platform instead
- ❌ No direct Apple Health access — web apps can't read HealthKit data at all

### 3. No-code (Shortcuts + Notes/Numbers)
- ✅ Genuinely lives in iCloud, no dev environment needed
- ❌ UI limited to Shortcuts' input menus — no custom screens

### 4. React Native / Expo
- ✅ Reuses existing React/TypeScript skills
- ❌ Still needs Xcode + a Mac to install on-device

## Tooling Note
**Claude Code** (not Cowork) is the right tool for actually building any of the code-based options — it runs in the terminal/IDE on your own machine, with direct file access and the ability to drive Xcode builds (e.g. via the XcodeBuildMCP server). Cowork is built for non-developer knowledge work and isn't suited to compiling Swift or driving Xcode.

## Decision: Hybrid Approach
**Web app, hosted on Netlify, passcode-protected, with an Apple Shortcuts bridge for Health data.**

| Piece | How |
|---|---|
| Frontend | React/HTML app, hosted on Netlify (reusing the domain already being set up via GoDaddy), added to the iPhone Home Screen for an app-like feel |
| Privacy | A Netlify Edge Function checks a passcode server-side and sets a session cookie — works on the free plan |
| Data storage | Netlify Blobs (built-in key-value store) — avoids iOS Safari clearing local browser storage after a period of inactivity |
| Manual logging | In-app quick-tap forms for meals and snacks |
| Exercise data | An Apple Shortcuts automation reads workouts/steps/active energy from Health and posts it to a separate, secret-key-protected Netlify Function |
| Weekly review + advice | A function pulls the week's data from Blobs, computes stats, and calls Claude (via Netlify's AI Gateway) to generate a personalized written summary |

## Trade-off Accepted
Data will live on Netlify's infrastructure — private and passcode-gated, but **not** in Apple's iCloud. This was chosen deliberately, trading deeper native iCloud/HealthKit integration for build simplicity and speed.

## Open Next Steps
- Define specific habit categories and data fields to log (meal type, snack type, portion/quality, etc.)
- Define the weekly metrics and the tone/format of the AI-generated advice
- Decide: same Netlify site as the existing domain, or a separate subdomain
- Build the Shortcuts automation
- Build the passcode gate and app screens
