# Super Star ⭐ — Gold Star Tracker

A mobile-first app for parents to track their children's gold star achievements.
Child does well → gold star added. Child misbehaves → gold star removed.

## Features

- **Multiple children** — each with their own name, emoji avatar, and colour
- **Add / remove stars** with quick-pick reasons ("Tidied their room", "Had a tantrum"…) or your own custom reason
- **Reward goals** — set a star target per child (e.g. 10 stars = trip to the park) with a progress bar and a celebration when it's reached
- **History log** per child — every star given or taken away, with reason and time
- **Star burst animations** and a visual star shelf to keep kids motivated
- **Works offline** — all data is stored locally on the device (localStorage), no account or server needed
- **Installable PWA** — add it to the iPhone/Android home screen and it opens full-screen like a native app

## Run it

No build step. Serve the folder with any static server, or just open `index.html`:

```
python3 -m http.server 8000 --directory super-star
```

It also deploys as-is with the rest of this repo on Netlify — it's available at `/super-star/`.

## Add to iPhone Home Screen

1. Open `https://YOUR-SITE.netlify.app/super-star/` in Safari
2. Tap **Share → Add to Home Screen**
3. Name it "Super Star" → Add

## Tech

Single-file vanilla HTML/CSS/JS — no frameworks, no dependencies, no build toolchain.
