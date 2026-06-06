# Harsh Vardhan Gupta — Portfolio

A single-page personal portfolio. **Systems engineer × explorer** — editorial dark/light
design with a cool-teal (engineering) and warm-amber (travel) accent system, an interactive
**3D globe** of places visited, and a themed "Off the clock" gallery you can edit in one file.

Static site — **no build step.** Plain HTML/CSS/JS. The only dependency is Three.js, loaded
from a CDN at runtime for the globe.

## Preview locally

> ⚠️ **Use a local server, not a double-click.** The 3D globe is an ES module, and browsers
> block module scripts when you open a file directly (`file://`). A server fixes this:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000**. (On the live https site this is a non-issue.)

## Deploy

Already hosted on **GitHub Pages**: https://harshelite2503.github.io/
To update after editing:

```bash
git add -A
git commit -m "update"
git push
```

Pages rebuilds in ~1 minute. (Also works on Netlify / Vercel / Cloudflare Pages — static, no build command.)

## Structure

```
index.html                      # markup + the Three.js import map
assets/css/styles.css           # design system, responsive, light/dark
assets/js/main.js               # theme, nav, reveals, count-ups, lightbox, 3D tilt,
                                #   and the renderer for the "Off the clock" sections
assets/js/beyond-data.js        # ← THE FILE YOU EDIT: all "Off the clock" content
assets/js/globe.js              # the interactive 3D globe (Three.js)
assets/img/                     # hero/about photos, favicon, OG image, résumé
assets/img/beyond/<category>/   # the themed gallery photos (cities, furry, activities, music)
```

## ✏️ Editing "Off the clock" — everything is in `assets/js/beyond-data.js`

That one file controls the stats, the globe pins, and the four sections
(**Exploring cities · Furry friends · Activities · At the piano**). The top of the file has
step-by-step comments. The essentials:

**Add a photo to a section**
1. Drop the image into the matching folder, e.g. `assets/img/beyond/cities/tokyo.jpg`
   (optionally make a `.webp` next to it for speed: `magick tokyo.jpg -quality 82 tokyo.webp`)
2. Add one line to that section's `items` array:
   ```js
   { img: "assets/img/beyond/cities/tokyo.jpg", w: 1200, h: 1600,
     location: "Tokyo", caption: "Shibuya crossing", alt: "Neon crossing at night" }
   ```
   `w`/`h` are the image's pixel dimensions (they prevent layout jump).

**Add a new section** — copy one of the category blocks in `categories: [ ... ]` and give it a
new `id`, `kicker`, `title`, `blurb`, and `items`.

**Edit the travel numbers** — change the `stats` array at the top.

**Add/remove globe pins** — edit the `places` array (`{ lat, lng, label }`; `home: true` glows amber).

## 🎹 The Music section (your videos)

Two ways to show your piano videos — pick either or both:

1. **Google Drive folder (already wired up).** Your folder is embedded on the page. For visitors
   to see it (instead of a Google sign-in box), open the folder in Drive → **Share** →
   **General access → "Anyone with the link" → Viewer.** That's the only step needed.
2. **Featured clips inline (smoothest playback).** Upload to YouTube (unlisted is fine) and add
   them to the `music.videos` array:
   ```js
   videos: [ { type: "youtube", id: "VIDEO_ID", title: "Clair de Lune" } ]
   ```
   (Drive files also work: `{ type: "drive", id: "DRIVE_FILE_ID", title: "..." }`.)

Replace the two placeholder tiles by adding your real piano photos to
`assets/img/beyond/music/` and listing them in `music.items` (then delete the placeholder lines).

## Still to personalize  ⚠️

Search the code for `TODO Harsh`:
1. **Social links** (Contact section in `index.html`) — add your real LinkedIn/GitHub URLs.
2. **Travel numbers** (`beyond-data.js` → `stats`) — set your real counts.
3. **Music** — make the Drive folder public (above) and/or add YouTube clips + your piano photos.

Everything else (email, phone, experience, projects, publications, captions) is already filled in.

## Quality notes

- Interactive **3D globe** (Three.js) with location pins — falls back to a CSS sphere if WebGL
  is unavailable, and stops auto-spinning under `prefers-reduced-motion`.
- Light **and** dark themes; respects OS preference and remembers your choice.
- Subtle **3D tilt** on gallery photos (pointer devices only, motion-safe).
- Keyboard-accessible nav, gallery, and lightbox (Esc / ← / →).
- Lazy-loaded images with reserved dimensions (no layout shift); WebP with JPG fallback.
- Responsive from 360px phones to large desktops.
