# Harsh Vardhan Gupta — Portfolio

A single-page personal portfolio. **Systems engineer × explorer** — editorial dark/light
design with a cool-teal (engineering) and warm-amber (travel) accent system.

Pure static site — **no build step, no dependencies.** Just HTML, CSS, and vanilla JS.

## Preview locally

Open a terminal in this folder and run any static server, e.g.:

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000**. (Opening `index.html` directly also works, but a
server is closer to production.)

## Deploy (free options)

Because it's static, you can drag-and-drop the whole folder:

- **Netlify** — drag the folder onto https://app.netlify.com/drop
- **Vercel** — `vercel` in this folder, or import via the dashboard
- **GitHub Pages** — push to a repo, enable Pages on the `main` branch (root)
- **Cloudflare Pages** — connect the repo, no build command, output dir `/`

## Structure

```
index.html                 # all the content/markup
assets/css/styles.css      # design system + responsive + light/dark themes
assets/js/main.js          # theme toggle, nav, scroll reveals, count-ups, lightbox
assets/img/                # web-optimized photos (WebP + JPG fallback) + favicon + OG image
assets/Harsh_..._Resume.pdf# downloadable résumé (linked from the nav + contact)
Harsh_photos/              # your original photos (kept for reference; not used by the site)
Harsh_CV_final.pdf         # your original résumé
```

Photos were converted from HEIC to optimized **WebP (primary) + JPG (fallback)**, EXIF-rotated,
stripped of metadata, and resized. Originals are untouched in `Harsh_photos/`.

## Things to personalize  ⚠️

Search the code for `TODO Harsh` — there are a few spots to make it truly yours:

1. **Social links** (`index.html`, Contact section): the LinkedIn and GitHub icons currently
   point to placeholder URLs. Drop in your real profile links.
2. **Travel stats** (`index.html`, Beyond Code section): the numbers
   (`12+ countries`, `25+ cities`, `15+ dives`, `50+ cuisines`) are placeholders — set them to
   your real counts via the `data-count` attributes.
3. **Photo captions/locations** (Beyond Code gallery): I captioned each shot with my best guess
   at the place (Bangkok, San Diego, Las Vegas, etc.). Fix any I got wrong in the `figcaption`
   and `data-caption` of each `<figure>`.

Everything else — email (`harshelite.gupta@gmail.com`), phone, experience, projects, publications —
is pulled straight from your résumé.

## Swapping or adding photos

1. Drop a new image into `Harsh_photos/` (or anywhere).
2. Convert + optimize it (macOS example):
   ```bash
   sips -s format jpeg INPUT.HEIC --out assets/img/NAME.jpg
   magick assets/img/NAME.jpg -auto-orient -strip -resize '1500x1500>' -quality 84 assets/img/NAME.jpg
   magick assets/img/NAME.jpg -quality 82 assets/img/NAME.webp
   ```
3. Add a `<figure class="gallery__item">` block in the Beyond Code gallery, following the
   existing pattern (include `width`/`height` to avoid layout shift).

## Accessibility & quality notes

- Light **and** dark themes (toggle in the nav; respects your OS preference, remembers your choice).
- Respects `prefers-reduced-motion` (animations and count-ups degrade gracefully).
- Keyboard-accessible nav, gallery, and lightbox (Esc / ← / → in the viewer).
- Semantic landmarks, alt text on every photo, visible focus rings, AA-contrast color pairs.
- Lazy-loaded images with reserved dimensions (no layout shift), WebP with JPG fallback.
- Responsive from 360px phones up to large desktops.
