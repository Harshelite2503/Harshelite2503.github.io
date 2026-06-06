/* =========================================================
   Interactive 3D globe of places visited (Three.js)
   - Drag to rotate, auto-spins, glowing pins + labels
   - Degrades to a CSS sphere if WebGL is unavailable
   - Respects prefers-reduced-motion (no auto-spin)
   ========================================================= */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const mount = document.getElementById("globe");
const labelLayer = document.getElementById("globeLabels");
const places = (window.BEYOND_DATA && window.BEYOND_DATA.places) || [];

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch (e) { return false; }
}

if (mount && places.length && hasWebGL()) {
  try { initGlobe(); } catch (e) { console.warn("Globe init failed; using fallback.", e); }
}

function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function glowTexture(hex) {
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, hex);
  g.addColorStop(0.35, hex);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  tex.anisotropy = 2;
  return tex;
}

function initGlobe() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TEAL = 0x2dd4bf, AMBER = 0xfb923c;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);
  mount.classList.add("is-3d");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 3.1);

  const group = new THREE.Group();
  group.rotation.y = -1.2;
  scene.add(group);

  // Dark inner sphere (gives the dots a body + occludes the far side)
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.985, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0x0b1016 })
  );
  group.add(core);

  // Faint rim
  const rim = new THREE.Mesh(
    new THREE.SphereGeometry(1.002, 48, 48),
    new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.05, side: THREE.BackSide })
  );
  group.add(rim);

  // Point-cloud surface (fibonacci distribution)
  const N = 1500;
  const pos = new Float32Array(N * 3);
  const inc = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const t = inc * i;
    pos[i * 3] = Math.cos(t) * rad;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(t) * rad;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: TEAL, size: 0.021, transparent: true, opacity: 0.7, depthWrite: false })
  );
  group.add(points);

  // Pins + HTML labels
  const tealTex = glowTexture("rgba(94,234,212,1)");
  const amberTex = glowTexture("rgba(251,146,60,1)");
  const pins = [];
  places.forEach((p) => {
    const v = latLngToVec3(p.lat, p.lng, 1.0);
    const isHome = !!p.home;

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(isHome ? 0.028 : 0.02, 12, 12),
      new THREE.MeshBasicMaterial({ color: isHome ? AMBER : TEAL })
    );
    dot.position.copy(v);
    group.add(dot);

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: isHome ? amberTex : tealTex, transparent: true, opacity: 0.9, depthWrite: false,
      blending: THREE.AdditiveBlending
    }));
    halo.position.copy(v.clone().multiplyScalar(1.001));
    halo.scale.setScalar(isHome ? 0.16 : 0.12);
    group.add(halo);

    let el = null;
    if (labelLayer) {
      el = document.createElement("div");
      el.className = "globe__label" + (isHome ? " is-home" : "");
      el.textContent = p.label;
      labelLayer.appendChild(el);
    }
    pins.push({ v: v.clone(), el, isHome });
  });

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.5;
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.55;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.82;

  // Keep labels glued to their pins; hide ones on the far side
  const tmp = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  function updateLabels(w, h) {
    if (!labelLayer) return;
    camera.getWorldDirection(camDir);
    for (const pin of pins) {
      if (!pin.el) continue;
      tmp.copy(pin.v).applyMatrix4(group.matrixWorld);
      const normal = tmp.clone().normalize();
      const toCam = camera.position.clone().sub(tmp).normalize();
      const facing = normal.dot(toCam);          // >0 = front hemisphere
      const ndc = tmp.clone().project(camera);
      const x = (ndc.x * 0.5 + 0.5) * w;
      const y = (-ndc.y * 0.5 + 0.5) * h - 14;
      pin.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      pin.el.style.opacity = facing > 0.12 ? Math.min(1, (facing - 0.12) * 3).toFixed(2) : "0";
    }
  }

  function resize() {
    const w = mount.clientWidth, h = mount.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  if (window.ResizeObserver) new ResizeObserver(resize).observe(mount);
  else window.addEventListener("resize", resize);

  // Render only while visible
  let visible = true, raf = null;
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    controls.update();
    renderer.render(scene, camera);
    updateLabels(mount.clientWidth, mount.clientHeight);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    }, { threshold: 0.05 }).observe(mount);
  }
  resize();
  frame();
}
