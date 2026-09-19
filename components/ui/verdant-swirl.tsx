"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import {
  useDocumentVisible,
  usePerfProfile,
} from "@/components/hooks/usePerfProfile";

/** Verdant Swirl palette (21st.dev / Serafim Silk-style) */
const VERDANT_COLORS = {
  deep: "#03120E",
  forest: "#0E7C5A",
  sprout: "#7CE577",
  highlight: "#F4FFC7",
} as const;

/** High-key mist for light content sections — soft celadon silk, still ink-safe */
const VERDANT_MIST = {
  deep: "#EEF6F1",
  forest: "#C4DFD1",
  sprout: "#8FCBAA",
  highlight: "#D8EBB8",
} as const;

/** Muted glow for dark panels — soft sage, not neon CTA */
const VERDANT_GLOW = {
  deep: "#0c1813",
  forest: "#1a4032",
  sprout: "#3d7358",
  highlight: "#9bb89a",
} as const;

type VerdantPalette = "classic" | "mist" | "glow";

const PALETTES: Record<
  VerdantPalette,
  { deep: string; forest: string; sprout: string; highlight: string }
> = {
  classic: VERDANT_COLORS,
  mist: VERDANT_MIST,
  glow: VERDANT_GLOW,
};

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Silk-style verdant swirl — domain-warped FBM through a 4-stop green palette.
 * Octaves scale with device tier so mid/low phones keep the look with less fill cost.
 */
const FRAG = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4;
uniform float u_speed;
uniform float u_energy;
uniform float u_key;
uniform float u_octaves;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    if (float(i) >= u_octaves) break;
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

vec3 palette(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mix(u_c1, u_c2, smoothstep(0.0, 0.38, t));
  c = mix(c, u_c3, smoothstep(0.28, 0.68, t));
  c = mix(c, u_c4, smoothstep(0.58, 1.0, t));
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  float e = max(u_energy, 1.0);
  float t = u_time * u_speed * (0.7 + 0.2 * e);

  float ang = t * (0.08 + 0.04 * (e - 1.0));
  float ca = cos(ang);
  float sa = sin(ang);
  p = mat2(ca, -sa, sa, ca) * p;

  float warp = 0.7 + 0.25 * (e - 1.0);
  float n1 = fbm(p * 2.0 + vec2(t * 0.1, -t * 0.06));
  vec2 q = p + vec2(n1 * warp, fbm(p * 1.85 - t * 0.07) * warp);
  float n2 = fbm(q * 2.35 + vec2(-t * 0.08, t * 0.12));
  vec2 r = q + vec2(n2 * (0.55 + 0.15 * (e - 1.0)), fbm(q * 2.8 + t * 0.06) * 0.55);

  float silk = fbm(r * 2.15 + t * 0.04);
  silk = silk * 0.7 + n2 * 0.3;

  float vig = smoothstep(1.35, 0.15, length(p * 1.05));
  float edgeMul = mix(0.35, 0.82, clamp(u_key, 0.0, 1.0));
  silk = mix(silk * edgeMul, silk, vig);

  vec3 col = palette(silk);
  float sheen = (0.025 + 0.02 * (e - 1.0)) * sin(silk * 6.28318 + t * (0.7 + 0.2 * (e - 1.0)));
  col += u_c4 * (sheen + 0.012 + 0.008 * (e - 1.0));
  col = mix(col, u_c3, 0.03 * (e - 1.0) * (0.5 + 0.5 * sin(t * 0.9 + silk * 3.0)));
  col = mix(col, u_c1, 0.22 * clamp(u_key, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  ];
}

function compile(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type VerdantSwirlProps = {
  className?: string;
  /** Animation speed multiplier (default 1) */
  speed?: number;
  /** Opacity of the canvas layer (default 1) */
  opacity?: number;
  /** Motion / sheen intensity (1 = classic CTA, >1 = livelier wash) */
  energy?: number;
  /** Cap device pixel ratio for lighter washes (default from PerfProfile) */
  maxDpr?: number;
  /** Pause RAF when false (offscreen) — uses ref, does not remount GL */
  active?: boolean;
  /** Color story: classic CTA, mist (light sections), glow (dark sections) */
  palette?: VerdantPalette;
};

function VerdantCssFallback({
  className,
  opacity,
  palette,
}: {
  className: string;
  opacity: number;
  palette: VerdantPalette;
}) {
  const swatch = PALETTES[palette];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        opacity,
        background: `
          radial-gradient(ellipse 80% 70% at 20% 30%, ${swatch.sprout}55, transparent 60%),
          radial-gradient(ellipse 70% 60% at 80% 70%, ${swatch.forest}66, transparent 55%),
          linear-gradient(135deg, ${swatch.deep} 0%, ${swatch.forest} 48%, ${swatch.highlight}33 100%)
        `,
      }}
    />
  );
}

export function VerdantSwirl({
  className = "",
  speed = 1,
  opacity = 1,
  energy = 1,
  maxDpr,
  active = true,
  palette = "classic",
}: VerdantSwirlProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const perf = usePerfProfile();
  const docVisible = useDocumentVisible();
  const activeRef = useRef(active && docVisible);
  const maxDprRef = useRef(maxDpr ?? perf.verdantMaxDpr);
  const fpsRef = useRef(perf.verdantTargetFps);
  const tierRef = useRef(perf.tier);

  useEffect(() => {
    activeRef.current = active && docVisible;
  }, [active, docVisible]);

  useEffect(() => {
    maxDprRef.current = maxDpr ?? perf.verdantMaxDpr;
    fpsRef.current = perf.verdantTargetFps;
    tierRef.current = perf.tier;
  }, [maxDpr, perf.verdantMaxDpr, perf.verdantTargetFps, perf.tier]);

  const useWebgl = !reduce;

  useEffect(() => {
    if (!useWebgl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uEnergy = gl.getUniformLocation(program, "u_energy");
    const uKey = gl.getUniformLocation(program, "u_key");
    const uOctaves = gl.getUniformLocation(program, "u_octaves");
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");
    const uC3 = gl.getUniformLocation(program, "u_c3");
    const uC4 = gl.getUniformLocation(program, "u_c4");

    const swatch = PALETTES[palette];
    const c1 = hexToRgb(swatch.deep);
    const c2 = hexToRgb(swatch.forest);
    const c3 = hexToRgb(swatch.sprout);
    const c4 = hexToRgb(swatch.highlight);

    gl.uniform3fv(uC1, c1);
    gl.uniform3fv(uC2, c2);
    gl.uniform3fv(uC3, c3);
    gl.uniform3fv(uC4, c4);
    gl.uniform1f(uSpeed, reduce ? 0 : speed);
    gl.uniform1f(uEnergy, energy);
    gl.uniform1f(uKey, palette === "mist" ? 0.55 : palette === "glow" ? 0.25 : 0);

    let raf = 0;
    const start = performance.now();
    let elapsedAtPause = 1.8;
    let lastFrame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDprRef.current);
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 1;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || 1;
      const pw = Math.max(1, Math.floor(w * dpr));
      const ph = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const running = !reduce && activeRef.current;
      if (!running) return;

      const minDelta = 1000 / Math.max(1, fpsRef.current);
      if (now - lastFrame < minDelta) return;
      lastFrame = now;

      gl.uniform1f(uOctaves, tierRef.current === "low" ? 3 : 5);
      resize();
      const t = (now - start) / 1000;
      elapsedAtPause = t;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    resize();
    gl.uniform1f(uOctaves, tierRef.current === "low" ? 3 : 5);
    gl.uniform1f(uTime, elapsedAtPause);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    raf = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      if (reduce || !activeRef.current) {
        gl.uniform1f(uTime, elapsedAtPause);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [reduce, speed, energy, palette, useWebgl]);

  if (!useWebgl) {
    return (
      <VerdantCssFallback
        className={className}
        opacity={opacity}
        palette={palette}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    />
  );
}

/** Full-bleed section wrapper with verdant swirl background */
export function VerdantSwirlSection({
  children,
  className = "",
  innerClassName = "",
  speed = 1,
  id,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  speed?: number;
  id?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "80px", threshold: 0.02 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id={id}
      className={`relative overflow-hidden bg-[#03120E] ${className}`}
    >
      <VerdantSwirl speed={speed} active={active} />
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </section>
  );
}
