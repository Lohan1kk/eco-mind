"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

/** Verdant Swirl palette (21st.dev / Serafim Silk-style) */
export const VERDANT_COLORS = {
  deep: "#03120E",
  forest: "#0E7C5A",
  sprout: "#7CE577",
  highlight: "#F4FFC7",
} as const;

/** High-key mist for light content sections — soft celadon silk, still ink-safe */
export const VERDANT_MIST = {
  deep: "#EEF6F1",
  forest: "#C4DFD1",
  sprout: "#8FCBAA",
  highlight: "#D8EBB8",
} as const;

/** Muted glow for dark panels — soft sage, not neon CTA */
export const VERDANT_GLOW = {
  deep: "#0c1813",
  forest: "#1a4032",
  sprout: "#3d7358",
  highlight: "#9bb89a",
} as const;

export type VerdantPalette = "classic" | "mist" | "glow";

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
 * Recreated to match Verdant Swirl (#03120E → #0E7C5A → #7CE577 → #F4FFC7).
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
  for (int i = 0; i < 3; i++) {
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

  // Silk swirl: rotate + dual domain warp (energy makes flow livelier)
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

  // Vignette: classic goes deep at edges; high-key (mist) stays airy
  float vig = smoothstep(1.35, 0.15, length(p * 1.05));
  float edgeMul = mix(0.35, 0.82, clamp(u_key, 0.0, 1.0));
  silk = mix(silk * edgeMul, silk, vig);

  vec3 col = palette(silk);
  // Silk sheen — gentle when energy is near 1
  float sheen = (0.025 + 0.02 * (e - 1.0)) * sin(silk * 6.28318 + t * (0.7 + 0.2 * (e - 1.0)));
  col += u_c4 * (sheen + 0.012 + 0.008 * (e - 1.0));
  // Soft sprout drift for living wash
  col = mix(col, u_c3, 0.03 * (e - 1.0) * (0.5 + 0.5 * sin(t * 0.9 + silk * 3.0)));
  // Lift mist washes toward paper so ink stays crisp
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
  /** Cap device pixel ratio for lighter washes (default 1.75) */
  maxDpr?: number;
  /** Pause RAF when false (offscreen) */
  active?: boolean;
  /** Color story: classic CTA, mist (light sections), glow (dark sections) */
  palette?: VerdantPalette;
};

export function VerdantSwirl({
  className = "",
  speed = 1,
  opacity = 1,
  energy = 1,
  maxDpr = 1.75,
  active = true,
  palette = "classic",
}: VerdantSwirlProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const lowPower = useLowPowerMode();
  const activeRef = useRef(active);
  activeRef.current = active;
  const kickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (lowPower) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let lost = false;
    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) return;

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    canvas.addEventListener("webglcontextlost", onLost, false);

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      canvas.removeEventListener("webglcontextlost", onLost);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      canvas.removeEventListener("webglcontextlost", onLost);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      canvas.removeEventListener("webglcontextlost", onLost);
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
    let start = performance.now();
    let elapsedAtPause = 1.8;
    const softCap = Math.min(maxDpr, 1.25);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, softCap);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
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
      if (lost) return;
      const frozen = Boolean(reduce) || !activeRef.current;
      resize();
      if (frozen) {
        gl.uniform1f(uTime, elapsedAtPause);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return;
      }
      const t = (now - start) / 1000;
      elapsedAtPause = t;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(draw);
    };

    const kick = () => {
      cancelAnimationFrame(raf);
      if (lost) return;
      if (reduce || !activeRef.current) {
        draw(performance.now());
      } else {
        start = performance.now() - elapsedAtPause * 1000;
        raf = requestAnimationFrame(draw);
      }
    };
    kickRef.current = kick;

    resize();
    kick();

    const onResize = () => kick();
    window.addEventListener("resize", onResize);

    return () => {
      kickRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [reduce, lowPower, speed, energy, maxDpr, palette]);

  useEffect(() => {
    kickRef.current?.();
  }, [active]);

  if (lowPower) return null;

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
  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-[#03120E] ${className}`}
    >
      <VerdantSwirl speed={speed} />
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </section>
  );
}
