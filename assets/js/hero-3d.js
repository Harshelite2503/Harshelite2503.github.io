/* =========================================================
   Fixed full-page 3D background (Three.js)
   - Neon particle field (cyan / violet / blue) with additive glow
   - Drifting wireframe geometry (icosahedron, torus knot, octahedron)
   - Mouse parallax on the camera, dims as you scroll past the hero
   - Skips entirely on reduced motion / no WebGL; hidden in light theme
   ========================================================= */
import * as THREE from "three";

const mount = document.getElementById("bg3d");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
  } catch (e) { return false; }
}

if (mount && !reduce && hasWebGL()) {
  try { init(); } catch (e) { console.warn("3D background init failed.", e); }
}

/* Soft round sprite so points render as glowing orbs, not squares */
function softDotTexture() {
  const s = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(cv);
}

function init() {
  const isMobile = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.z = 22;

  const group = new THREE.Group();
  scene.add(group);

  const tex = softDotTexture();
  function cloud(n, color, size, opacity, spread) {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 1.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color, size, map: tex,
      transparent: true, opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    return new THREE.Points(geo, mat);
  }

  const cyan   = cloud(isMobile ? 420 : 900, 0x22d3ee, 0.22, 0.75, 26);
  const violet = cloud(isMobile ? 260 : 550, 0xa78bfa, 0.30, 0.55, 30);
  const blue   = cloud(isMobile ? 200 : 450, 0x60a5fa, 0.16, 0.45, 22);
  group.add(cyan, violet, blue);

  function wire(geo, color, opacity) {
    return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity }));
  }
  const ico = wire(new THREE.IcosahedronGeometry(5.5, 1), 0x22d3ee, 0.10);
  ico.position.set(13, 3, -8);
  const knot = wire(new THREE.TorusKnotGeometry(3.2, 0.9, 90, 12), 0xa78bfa, 0.08);
  knot.position.set(-14, -5, -10);
  const octa = wire(new THREE.OctahedronGeometry(2.2, 0), 0x60a5fa, 0.12);
  octa.position.set(-9, 6, -6);
  group.add(ico, knot, octa);

  // pointer parallax target
  let tx = 0, ty = 0;
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  // dim the field once you scroll past the hero
  const onScroll = () => {
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    mount.style.opacity = String(1 - p * 0.65);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // canvas is display:none in light theme — skip the GPU work too
  const lightTheme = () => document.documentElement.getAttribute("data-theme") === "light";

  const clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden || lightTheme()) return;
    const t = clock.getElapsedTime();

    group.rotation.y = t * 0.02 + window.scrollY * 0.00012;
    cyan.rotation.y = t * 0.012;
    violet.rotation.y = -t * 0.009;
    blue.rotation.x = t * 0.006;
    ico.rotation.x = t * 0.12;  ico.rotation.y = t * 0.09;
    knot.rotation.x = -t * 0.08; knot.rotation.y = t * 0.11;
    octa.rotation.y = t * 0.15;

    camera.position.x += (tx * 3 - camera.position.x) * 0.04;
    camera.position.y += (-ty * 2 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  frame();
}
