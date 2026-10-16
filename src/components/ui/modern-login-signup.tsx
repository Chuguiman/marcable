"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Dot colors per color scheme (RGB 0–1): menu-text green on light, brand green on dark
const LIGHT_DOT = [13 / 255, 48 / 255, 45 / 255];
const DARK_DOT = [105 / 255, 234 / 255, 155 / 255];

const vertexShader = `
  precision mediump float;
  uniform vec2 u_resolution;
  out vec2 fragCoord;
  void main() {
    gl_Position = vec4(position, 1.0);
    fragCoord = (position.xy + 1.0) * 0.5 * u_resolution;
    fragCoord.y = u_resolution.y - fragCoord.y;
  }
`;

const fragmentShader = `
  precision mediump float;
  in vec2 fragCoord;

  uniform float u_time;
  uniform float u_opacities[10];
  uniform vec3 u_color;
  uniform float u_total_size;
  uniform float u_dot_size;
  uniform vec2 u_resolution;

  out vec4 fragColor;

  float PHI = 1.61803398874989484820459;
  float random(vec2 xy) {
    return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
  }

  void main() {
    vec2 st = fragCoord.xy;
    st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
    st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

    float opacity = step(0.0, st.x) * step(0.0, st.y);
    vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

    float frequency = 5.0;
    float show_offset = random(st2);
    float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
    opacity *= u_opacities[int(rand * 10.0)];
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
    opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

    vec2 center_grid = u_resolution / 2.0 / u_total_size;
    float dist_from_center = distance(center_grid, st2);
    float timing_offset = dist_from_center * 0.01 + (random(st2) * 0.15);
    opacity *= step(timing_offset, u_time * 3.0);

    fragColor = vec4(u_color * opacity, opacity);
  }
`;

/** Animated WebGL dot matrix that fills its positioned parent. */
export function DotMatrixBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
      renderer.setPixelRatio(window.devicePixelRatio);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const scheme = window.matchMedia("(prefers-color-scheme: dark)");
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dotColor = () => new THREE.Vector3(...(scheme.matches ? DARK_DOT : LIGHT_DOT));

      const uniforms = {
        u_time: { value: reducedMotion ? 100 : 0 },
        u_resolution: { value: new THREE.Vector2() },
        u_opacities: { value: [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1.0] },
        u_color: { value: dotColor() },
        u_total_size: { value: 20.0 },
        u_dot_size: { value: 6.0 },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        glslVersion: THREE.GLSL3,
        transparent: true,
        premultipliedAlpha: true,
      });
      scene.add(new THREE.Mesh(geometry, material));

      const resize = () => {
        const { clientWidth: w, clientHeight: h } = container;
        renderer.setSize(w, h);
        uniforms.u_resolution.value.set(w * 2, h * 2);        renderer.render(scene, camera);
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(container);

      const onSchemeChange = () => {
        uniforms.u_color.value = dotColor();
        renderer.render(scene, camera);
      };
      scheme.addEventListener("change", onSchemeChange);

      let animationId = 0;
      if (!reducedMotion) {
        const start = performance.now();
        const animate = () => {
          animationId = requestAnimationFrame(animate);
          uniforms.u_time.value = (performance.now() - start) / 1000;
          renderer.render(scene, camera);
        };
        animate();
      }

      cleanup = () => {
        cancelAnimationFrame(animationId);
        observer.disconnect();
        scheme.removeEventListener("change", onSchemeChange);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`absolute inset-0 ${className}`} />;
}

/** Auth panel: dot matrix background with a centered card holding the forms. */
export default function ModernLoginSignup({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-[#fafaf7] dark:bg-black px-6 py-12">
      <DotMatrixBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,250,247,0.85)_0%,rgba(250,250,247,0)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)]" />
      <div className="relative z-10 w-full max-w-sm rounded-xl border border-slate-200 dark:border-neutral-800 bg-white/95 dark:bg-[#121212] p-8 shadow-[0_10px_40px_rgba(13,48,45,0.12)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        {children}
      </div>
    </div>
  );
}
