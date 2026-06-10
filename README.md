# Harsh Vardhan Gupta — Portfolio

A single-page personal portfolio. **Systems engineer × explorer** — futuristic "Neon Systems"
design: a full-page **Three.js particle universe** with drifting wireframe geometry, a cyber
boot-sequence preloader, neon cyan→violet glassmorphism, a custom glowing cursor, magnetic
buttons, GSAP scroll effects, an interactive **3D globe** of places visited, and a themed
"Off the clock" gallery you can edit in one file. (Light theme = the clean, minimal mode.)

Static site — **no build step.** Plain HTML/CSS/JS. The only runtime dependencies are
Three.js (particle background + globe) and GSAP (motion), both loaded from a CDN.

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
index.html                      # markup + the Three.js import map + GSAP CDN
assets/css/styles.css           # design system, responsive, light/dark + the "future layer"
assets/js/main.js               # theme, nav, reveals, count-ups, lightbox, 3D tilt,
                                #   and the renderer for the "Off the clock" sections
assets/js/fx.js                 # preloader boot, custom cursor, magnetic buttons,
                                #   hero word reveal, scramble text, card spotlight/tilt,
                                #   GSAP scroll effects
assets/js/hero-3d.js            # full-page 3D particle background (Three.js)
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

## 🎹 The Music section

Already wired up: two piano photos plus three inline video players pulled from your
**public** Google Drive folder (the folder must stay shared as *"Anyone with the link"*).

**Add another recording** — put the clip in the Drive folder, grab its file ID (the part after
`/file/d/` in its share link), and add a line to `music.videos`:
```js
{ type: "drive", id: "DRIVE_FILE_ID", title: "Song name" }
```
YouTube works too and plays the smoothest: `{ type: "youtube", id: "VIDEO_ID", title: "..." }`.

**Add another photo** — drop it in `assets/img/beyond/music/` and add it to `music.items`
(same format as the other sections).

## Still to personalize  ⚠️

Search the code for `TODO Harsh`:
1. **Social links** (Contact section in `index.html`) — add your real LinkedIn/GitHub URLs.
2. **Travel numbers** (`beyond-data.js` → `stats`) — set your real counts.

(Music is done — the Drive folder is public and three covers are embedded.)

Everything else (email, phone, experience, projects, publications, captions) is already filled in.

## Quality notes

- Full-page **3D particle background** (Three.js) — mouse parallax, dims as you scroll, pauses
  in hidden tabs, fewer particles on mobile, skipped entirely under `prefers-reduced-motion`
  or without WebGL.
- **Boot-sequence preloader** with a CSS failsafe (auto-hides even if a script fails).
- Interactive **3D globe** (Three.js) with location pins — falls back to a CSS sphere if WebGL
  is unavailable, and stops auto-spinning under `prefers-reduced-motion`.
- Light **and** dark themes; dark (the futuristic look) is the default, and your choice is remembered.
- Custom cursor, magnetic buttons, and card spotlight/tilt run only on pointer devices and are
  disabled under `prefers-reduced-motion`. GSAP loads from a CDN; everything degrades gracefully
  without it.
- Subtle **3D tilt** on gallery photos (pointer devices only, motion-safe).
- Keyboard-accessible nav, gallery, and lightbox (Esc / ← / →).
- Lazy-loaded images with reserved dimensions (no layout shift); WebP with JPG fallback.
- Responsive from 360px phones to large desktops.
