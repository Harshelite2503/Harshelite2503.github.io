/* =========================================================
   Harsh Vardhan Gupta — Portfolio interactions
   ========================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const stored = (() => { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();
  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initial = stored || (systemLight ? "light" : "dark");
  setTheme(initial);

  function setTheme(mode) {
    root.setAttribute("data-theme", mode);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(mode === "light"));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", mode === "light" ? "#F7F8FA" : "#0A0C10");
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
  const figures = $$(".gallery__item");
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
})();
