"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * IGLOO-DIRECTION immersive hero.
 *
 * A full-bleed WebGL plane running a custom GLSL fragment shader: flowing
 * domain-warped noise that reacts to pointer position, tinted with an
 * Apple-grade gradient. This is real shader code (not a CSS gradient).
 *
 * Honest caveats baked into the component:
 *  - prefers-reduced-motion \u2192 renders a static CSS gradient (a11y + battery)
 *  - no WebGL context \u2192 graceful CSS-gradient fallback (never a blank canvas)
 *  - pauses rendering when the tab is hidden (no wasted GPU)
 *
 * The \"Awwwards feel\" is reached by a human tuning the uniforms live in the
 * browser \u2014 the code gets you a genuinely advanced, performant starting point.
 */

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uPointer;

  // hash + value noise
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), u.x),
               mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0; float a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / uRes.xy;
    vec2 p = uv * 3.0;
    float t = uTime * 0.08;
    vec2 warp = vec2(fbm(p + t), fbm(p - t + 5.2));
    float n = fbm(p + warp * 2.0 + uPointer * 0.6);

    vec3 a = vec3(0.04, 0.06, 0.16);   // deep indigo
    vec3 b = vec3(0.32, 0.18, 0.74);   // violet
    vec3 c = vec3(0.16, 0.62, 0.98);   // sky
    vec3 col = mix(a, b, smoothstep(0.2, 0.8, n));
    col = mix(col, c, smoothstep(0.5, 1.0, n) * 0.7);
    col += 0.04 * hash(uv * uTime); // subtle grain
    gl_FragColor = vec4(col, 1.0);
  }
`;

const VERT = /* glsl */ `
  void main(){ gl_Position = vec4(position, 1.0); }
`;

export function ShaderHero() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setFallback(true);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFallback(true);
      return;
    }

    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(w, h) },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const onPointer = (e: PointerEvent) => {
      uniforms.uPointer.value.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
    };
    window.addEventListener("pointermove", onPointer);

    const onResize = () => {
      const nw = mount.clientWidth || window.innerWidth;
      const nh = mount.clientHeight || window.innerHeight;
      renderer.setSize(nw, nh);
      uniforms.uRes.value.set(nw, nh);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();
    const loop = () => {
      if (!running) return;
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) loop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (fallback) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 120% at 50% 0%, #2a2dbd 0%, #0a0f29 60%, #05060f 100%)",
        }}
      />
    );
  }

  return <div ref={mountRef} aria-hidden className="absolute inset-0 -z-10" />;
}
