/* =========================================================
   FX layer — preloader boot, custom cursor, magnetic buttons,
   word-masked hero reveal, scramble text, spotlight + tilt cards,
   scroll progress, GSAP scroll effects.
   Degrades gracefully: no GSAP → static; reduced motion → off.
   ========================================================= */
(function () {
  "use strict";

  const html = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ---------- Preloader: boot sequence ---------- */
  const preBar = document.getElementById("preBar");
  const prePct = document.getElementById("prePct");
  const preStatus = document.getElementById("preStatus");
  const BOOT_LINES = ["booting systems…", "mounting /dev/portfolio…", "scheduling pods…", "ready."];

  function finishBoot() {
    html.classList.remove("is-booting");
    heroIntro();
  }

  if (reduce || !preBar) {
    finishBoot();
  } else {
    const DUR = 1100;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 2.2);
      preBar.style.transform = "scaleX(" + eased.toFixed(3) + ")";
      prePct.textContent = Math.round(eased * 100) + "%";
      preStatus.textContent = BOOT_LINES[Math.min(BOOT_LINES.length - 1, Math.floor(p * BOOT_LINES.length))];
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finishBoot, 150);
    })(t0);
  }

  /* ---------- Hero entrance ---------- */
  function heroIntro() {
    scrambleText();
    const hero = document.getElementById("hero");
    if (!hero || !hasGsap || reduce) return;
    hero.classList.add("gsap-hero");

    const words = splitWords(document.querySelector(".hero__title"));
    const tl = window.gsap.timeline({ defaults: { ease: "power4.out" } });
    if (words.length) tl.from(words, { yPercent: 115, duration: 0.9, stagger: 0.06 }, 0.05);
    tl.from(".hero__lede, .hero__cta, .hero__stats", { y: 32, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.35)
      .from(".hero__visual", { y: 48, opacity: 0, duration: 1 }, 0.3);
  }

  /* Split a heading into masked word spans; element children (e.g. the
     gradient accent word) are kept intact and wrapped whole. */
  function splitWords(el) {
    if (!el) return [];
    const out = [];
    const nodes = Array.from(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          const mask = document.createElement("span");
          mask.className = "wmask";
          const w = document.createElement("span");
          w.className = "w";
          w.textContent = tok;
          mask.appendChild(w);
          frag.appendChild(mask);
          out.push(w);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        const mask = document.createElement("span");
        mask.className = "wmask";
        el.replaceChild(mask, node);
        node.classList.add("w");
        mask.appendChild(node);
        out.push(node);
      }
    });
    return out;
  }

  /* ---------- Scramble / decode effect ---------- */
  function scrambleText() {
    const el = document.querySelector("[data-scramble]");
    if (!el || reduce) return;
    const final = el.textContent;
    const CHARS = "▓▒░<>/[]{}|=+*#01";
    const DUR = 900;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / DUR, 1);
      const n = Math.floor(p * final.length);
      let s = final.slice(0, n);
      for (let i = n; i < final.length; i++) {
        s += final[i] === " " ? " " : CHARS[(Math.random() * CHARS.length) | 0];
      }
      el.textContent = s;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = final;
    })(t0);
  }

  /* ---------- Scroll progress bar ---------- */
  const scrollBar = document.getElementById("scrollBar");
  if (scrollBar) {
    let raf = null;
    const update = function () {
      const max = html.scrollHeight - window.innerHeight;
      scrollBar.style.setProperty("--p", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
      raf = null;
    };
    window.addEventListener("scroll", function () {
      if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------- Custom cursor ---------- */
  if (fine && !reduce) {
    const cursor = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (cursor && dot && ring) {
      html.classList.add("fx-cursor");
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;
      let running = false;

      function loop() {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        dot.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
        ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
        requestAnimationFrame(loop);
      }
      window.addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        cursor.classList.remove("is-hidden");
        if (!running) { running = true; rx = mx; ry = my; loop(); }
      }, { passive: true });
      document.addEventListener("mouseleave", function () { cursor.classList.add("is-hidden"); });
      document.addEventListener("mouseover", function (e) {
        const t = e.target.closest("a, button, [role='button'], .gallery__item");
        cursor.classList.toggle("is-link", !!t);
      });
    }
  }

  /* ---------- Magnetic buttons ---------- */
  if (fine && !reduce && hasGsap) {
    document.querySelectorAll(".btn, .social, .icon-btn").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect();
        window.gsap.to(el, {
          x: (e.clientX - (r.left + r.width / 2)) * 0.25,
          y: (e.clientY - (r.top + r.height / 2)) * 0.25,
          duration: 0.3, ease: "power2.out"
        });
      });
      el.addEventListener("mouseleave", function () {
        window.gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
      });
    });
  }

  /* ---------- Spotlight + 3D tilt on cards ---------- */
  const cards = Array.from(document.querySelectorAll(".work-card, .timeline__card, .pub"));
  cards.forEach(function (c) { c.classList.add("spot"); });
  if (fine && !reduce) {
    const MAX = 5; // degrees
    cards.forEach(function (el) {
      el.classList.add("tilt");
      let raf = null;
      el.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
          el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
          el.style.setProperty("--rx", ((py - 0.5) * -MAX).toFixed(2) + "deg");
          el.style.setProperty("--ry", ((px - 0.5) * MAX).toFixed(2) + "deg");
          raf = null;
        });
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- GSAP scroll effects ---------- */
  if (hasGsap && window.ScrollTrigger && !reduce) {
    const gsap = window.gsap;

    // hero content drifts up + fades as you scroll past it
    gsap.to(".hero__inner", {
      y: -80, opacity: 0, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "85% top", scrub: true }
    });

    // gentle parallax on the about photo
    if (document.querySelector(".about__visual img")) {
      gsap.fromTo(".about__visual img", { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: ".about__visual", start: "top bottom", end: "bottom top", scrub: true }
      });
    }

    // neon timeline line draws itself as you scroll
    const tlEl = document.querySelector(".timeline");
    if (tlEl) {
      tlEl.style.setProperty("--draw", "0");
      window.ScrollTrigger.create({
        trigger: tlEl, start: "top 75%", end: "bottom 45%", scrub: true,
        onUpdate: function (self) { tlEl.style.setProperty("--draw", self.progress.toFixed(3)); }
      });
    }
  }
})();
