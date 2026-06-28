# Prompt for Claude Design

Design a prototype for a personal, private health and habit-tracking app for iPhone. It will run as a passcode-protected web app added to the Home Screen, so it should look and feel like a native iOS app, not a website.

## Purpose
Track eating habits, snack habits, and exercise day-to-day, then surface a weekly summary with personalized advice on what those habits mean for health and weight-loss goals.

## Screens needed
1. **Lock screen** — simple numeric passcode entry, minimal and calm
2. **Today / Home dashboard** — the main daily view:
   - Quick-tap buttons to log a meal or a snack
   - Today's exercise, shown automatically (pulled in from Apple Health)
   - A simple progress indicator for the day/week
3. **Log entry screen** — a fast, low-friction form for logging a meal or snack (type, rough portion or quality, optional note)
4. **Weekly Review** — the centerpiece screen:
   - Visual summary of the week's eating, snacking, and exercise patterns (trends, streaks, comparison to the prior week)
   - A written, personalized advice section (AI-generated) interpreting what the patterns mean for health/weight-loss goals
5. **Settings** (light touch) — change passcode, view/export data

## Style direction
- Clean, calm, encouraging — a health app, not a clinical one. Avoid guilt-inducing or alarming visual language.
- Native iOS look and feel: rounded cards, generous whitespace, iOS-style navigation (e.g. tab bar), system-style typography
- Support both light and dark mode
- Mobile-first, portrait orientation, iPhone screen proportions

## Interactivity
Make this a clickable prototype — tapping the quick-log buttons should lead to the log entry screen, and there should be a clear path from Home to Weekly Review and back.

This is an early prototype for personal use — favor a clear, simple flow over decorative complexity.
