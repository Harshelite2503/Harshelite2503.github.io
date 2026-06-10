/* =========================================================
   Harsh Vardhan Gupta — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Render "Beyond Code" from beyond-data.js (must run first) ---------- */
  renderBeyond();

  function sizeClass(w, h) {
    const r = w / h;
    if (r >= 1.35) return " gallery__item--wide";
    if (r <= 0.78) return " gallery__item--tall";
    return "";
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function figureHTML(it) {
    const isSvg = /\.svg$/.test(it.img);
    const caption = it.placeholder ? "" : `${esc(it.location || "")} — ${esc(it.caption || "")}`;
    const media = isSvg
      ? `<img src="${it.img}" width="${it.w}" height="${it.h}" loading="lazy" decoding="async" alt="${esc(it.alt || "")}" />`
      : `<picture><source type="image/webp" srcset="${it.img.replace(/\.jpg$/, ".webp")}" />` +
        `<img src="${it.img}" width="${it.w}" height="${it.h}" loading="lazy" decoding="async" alt="${esc(it.alt || "")}" /></picture>`;
    const cap = (it.location || it.caption)
      ? `<figcaption><span>${esc(it.location || "")}</span>${esc(it.caption || "")}</figcaption>` : "";
    return `<figure class="gallery__item${sizeClass(it.w, it.h)}${it.placeholder ? " is-placeholder" : ""}" data-caption="${caption}">${media}${cap}</figure>`;
  }
  function videoHTML(v) {
    const src = v.type === "drive"
      ? `https://drive.google.com/file/d/${v.id}/preview`
      : `https://www.youtube-nocookie.com/embed/${v.id}`;
    const cap = v.title
      ? `<figcaption class="video-card__cap"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>${esc(v.title)}</figcaption>`
      : "";
    return `<figure class="video-card">
        <div class="video-embed"><iframe src="${src}" title="${esc(v.title || "Video")}" loading="lazy" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>
        ${cap}
      </figure>`;
  }
  function renderBeyond() {
    const data = window.BEYOND_DATA;
    if (!data) return;

    const statsEl = document.getElementById("beyondStats");
    if (statsEl && Array.isArray(data.stats)) {
      statsEl.innerHTML = data.stats.map((s) =>
        `<li><span class="beyond__num" data-count="${s.num}" data-suffix="${s.suffix || ""}">0</span>` +
        `<span class="beyond__label">${esc(s.label)}</span></li>`
      ).join("");
    }

    const wrap = document.getElementById("beyondCategories");
    if (!wrap || !Array.isArray(data.categories)) return;
    wrap.innerHTML = data.categories.map((cat) => {
      const head = `<div class="cat__head">
            <span class="cat__kicker"><span class="cat__dot" aria-hidden="true"></span>${esc(cat.kicker)}</span>
            <h3 class="cat__title">${cat.title}</h3>
            ${cat.blurb ? `<p class="cat__blurb">${cat.blurb}</p>` : ""}
          </div>`;

      /* Music-style category: photos + inline recordings share ONE grid */
      if (cat.videos && cat.videos.length) {
        const vids = cat.videos.map(videoHTML);
        const phs = (cat.items || []).map(figureHTML);
        const tiles = [];
        for (let i = 0; i < Math.max(vids.length, phs.length); i++) {
          if (vids[i]) tiles.push(vids[i]);
          if (phs[i]) tiles.push(phs[i]);
        }
        const drive = cat.driveFolderId
          ? `<div class="music-media__foot"><a class="music-drive__link" href="https://drive.google.com/drive/folders/${cat.driveFolderId}" target="_blank" rel="noopener">More on Google Drive <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg></a></div>`
          : "";
        return `<section class="cat reveal" id="cat-${cat.id}">
          ${head}
          <div class="gallery">${tiles.join("")}</div>
          ${drive}
        </section>`;
      }

      /* Standard photo gallery */
      const figures = (cat.items || []).map(figureHTML).join("");
      const galleryCls = "gallery" + ((cat.items || []).length <= 2 ? " gallery--pair" : "");
      return `<section class="cat reveal" id="cat-${cat.id}">
          ${head}
          <div class="${galleryCls}">${figures}</div>
        </section>`;
    }).join("");
  }

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const stored = (() => { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
  // dark-first: the futuristic look is the default; visitors can still toggle
  const initial = stored || "dark";
  setTheme(initial);

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(mode === "light"));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "light" ? "#F7F8FA" : "#04060C");
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Nav scrolled state ---------- */
  const nav = $("#nav");
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $("#navBurger");
  const menu = $("#mobileMenu");
  function closeMenu() {
    if (!menu) return;
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }
  function openMenu() {
    menu.hidden = false;
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  if (burger && menu) {
    burger.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu()));
    $$(".mobile-menu__link", menu).forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) closeMenu(); });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const revObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // stagger items revealed together
            const delay = Math.min(i * 60, 240);
            entry.target.style.transitionDelay = delay + "ms";
            entry.target.classList.add("in");
            revObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => revObs.observe(el));
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Count-up stats ---------- */
  const counters = $$("[data-count]");
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window && counters.length) {
    const cObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { animateCount(entry.target); cObs.unobserve(entry.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => cObs.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Subtle hero parallax (pointer only, motion-safe) ---------- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    const blobs = $$(".hero__blob");
    const hero = $("#hero");
    if (hero && blobs.length) {
      let raf = null;
      hero.addEventListener("mousemove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = hero.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          const dy = (e.clientY - r.top) / r.height - 0.5;
          blobs.forEach((b, i) => {
            const f = (i + 1) * 18;
            b.style.transform = `translate(${dx * f}px, ${dy * f}px)`;
          });
          raf = null;
        });
      });
    }
  }

  /* ---------- Lightbox gallery ---------- */
  const figures = $$(".gallery__item:not(.is-placeholder)");
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbCaption = $("#lbCaption");
  const lbClose = $("#lbClose");
  const lbPrev = $("#lbPrev");
  const lbNext = $("#lbNext");
  let current = 0;
  let lastFocused = null;

  const items = figures.map((fig) => {
    const img = fig.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt"), caption: fig.dataset.caption || img.getAttribute("alt") };
  });

  function showItem(i) {
    current = (i + items.length) % items.length;
    const it = items[current];
    lbImg.setAttribute("src", it.src);
    lbImg.setAttribute("alt", it.alt);
    lbCaption.textContent = it.caption;
  }
  function openLightbox(i) {
    lastFocused = document.activeElement;
    showItem(i);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  figures.forEach((fig, i) => {
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "View photo: " + (fig.dataset.caption || ""));
    fig.addEventListener("click", () => openLightbox(i));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(i); }
    });
  });

  if (lightbox) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", () => showItem(current - 1));
    lbNext.addEventListener("click", () => showItem(current + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showItem(current - 1);
      else if (e.key === "ArrowRight") showItem(current + 1);
      else if (e.key === "Tab") {
        // simple focus trap within the lightbox controls
        const focusables = [lbClose, lbPrev, lbNext];
        const idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const dir = e.shiftKey ? -1 : 1;
        focusables[(idx + dir + focusables.length) % focusables.length].focus();
      }
    });
  }

  /* ---------- 3D tilt on gallery photos (pointer + motion-safe) ---------- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    const MAX = 7; // degrees
    $$(".gallery__item:not(.is-placeholder)").forEach((el) => {
      let raf = null;
      el.addEventListener("mousemove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--rx", (py * -MAX).toFixed(2) + "deg");
          el.style.setProperty("--ry", (px * MAX).toFixed(2) + "deg");
          raf = null;
        });
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }
})();
