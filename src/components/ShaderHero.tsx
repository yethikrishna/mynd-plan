"use client";

import { useEffect, useRef } from "react";

/**
 * ShaderHero — a real WebGL background driven by a custom GLSL fragment shader.
 *
 * Igloo-direction: domain-warped fbm noise, pointer-reactive, animated in a
 * requestAnimationFrame loop. This is genuine shader code, not a CSS gradient.
 *
 * Honest scope: the "jaw-drop" tuning (uniform values, color ramps, warp
 * strength) is meant to be iterated by eye in the browser. This ships a solid,
 * good-looking default.
 *
 * Robustness / graceful degradation:
 *  - prefers-reduced-motion: render one static frame, no animation loop.
 *  - no WebGL support: leave the CSS background (transparent canvas) and bail.
 *  - tab hidden: pause the loop (visibilitychange) to save GPU/battery.
 *
 * Three.js is imported dynamically so it never blocks first paint and is only
 * pulled in client-side.
 */
export default function ShaderHero() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let rafId = 0;
    let cleanup: (() => void) | null = null;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    (async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      // Detect WebGL support before constructing a renderer.
      try {
        const test = document.createElement("canvas");
        const ok =
          test.getContext("webgl") || test.getContext("experimental-webgl");
        if (!ok) return; // leave CSS fallback in place
      } catch {
        return;
      }

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uRes;
          uniform vec2 uPointer;

          // hash + value noise + fbm
          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
              v += a * noise(p);
              p *= 2.0;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 uv = vUv;
            float aspect = uRes.x / max(uRes.y, 1.0);
            vec2 p = uv;
            p.x *= aspect;

            // pointer-reactive domain warp
            vec2 ptr = uPointer;
            ptr.x *= aspect;
            float dist = distance(p, ptr);

            float t = uTime * 0.05;
            vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
            vec2 r = vec2(
              fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t),
              fbm(p + 4.0 * q + vec2(8.3, 2.8) - 0.12 * t)
            );
            float n = fbm(p + 4.0 * r + (0.25 - dist) * 0.8);

            // Apple-ish gradient ramp
            vec3 c1 = vec3(0.36, 0.46, 0.98); // indigo
            vec3 c2 = vec3(0.62, 0.40, 0.98); // violet
            vec3 c3 = vec3(0.96, 0.62, 0.86); // pink
            vec3 col = mix(c1, c2, smoothstep(0.2, 0.6, n));
            col = mix(col, c3, smoothstep(0.55, 0.95, n + 0.15 * (1.0 - dist)));

            // soft vignette
            float vig = smoothstep(1.2, 0.2, distance(uv, vec2(0.5)));
            col *= 0.85 + 0.15 * vig;

            gl_FragColor = vec4(col, 0.92);
          }
        `,
        transparent: true,
      });

      const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(quad);

      const el = mountRef.current;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      const resize = () => {
        const w = el.clientWidth || window.innerWidth;
        const h = el.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w, h);
      };
      resize();
      window.addEventListener("resize", resize);

      const onPointer = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        uniforms.uPointer.value.set(
          (e.clientX - rect.left) / Math.max(rect.width, 1),
          1 - (e.clientY - rect.top) / Math.max(rect.height, 1)
        );
      };
      window.addEventListener("pointermove", onPointer);

      const start = performance.now();
      const renderFrame = (now: number) => {
        uniforms.uTime.value = (now - start) / 1000;
        renderer.render(scene, camera);
      };

      const loop = (now: number) => {
        renderFrame(now);
        rafId = requestAnimationFrame(loop);
      };

      const onVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        } else if (!reduceMotion && rafId === 0) {
          rafId = requestAnimationFrame(loop);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      if (reduceMotion) {
        renderFrame(performance.now()); // single static frame
      } else {
        rafId = requestAnimationFrame(loop);
      }

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.dispose();
        material.dispose();
        quad.geometry.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
      };
    })();

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 120% at 50% 0%, #5b6ef5 0%, #9e66f9 45%, #f59 edb 100%)",
      }}
    />
  );
}
