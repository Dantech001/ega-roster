# Elite Global Athletes — roster site

Live: https://eliteglobalathletes.com
(`ega-roster.netlify.app` still serves it and is the CNAME target; don't retire it.)

Hand-coded static site. No build step: `index.html`, `styles.css`, `script.js`
and `assets/` are served as-is from the repository root.

## Editing

Edit the files directly. Push to `main` and Netlify deploys automatically.

## Roster cards

Each athlete is one `<article class="player">` in `index.html`. Photos are
cropped to **900×1100** (the card box is `aspect-ratio: 4/5`); anything else
gets cropped through the subject by `object-fit: cover`.

Status is the tag on the photo:
- `player__tag` — Signed
- `player__tag--available` — Now available
- `player__tag--nil` — NIL (college athlete)

The scrolling name strip (`.marquee__track`) must contain **two identical
halves** — the CSS scrolls it `translateX(-50%)`.

## Applications

The form posts to Netlify Forms (`name="representation"`) and emails
EliteGlobalAthletes@gmail.com on each submission. Submissions are also listed
under Forms in the Netlify dashboard.
