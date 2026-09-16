"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/** Verdant Swirl palette (21st.dev / Serafim Silk-style) */
export const VERDANT_COLORS = {
  deep: "#03120E",
  forest: "#0E7C5A",
  sprout: "#7CE577",
  highlight: "#F4FFC7",
} as const;

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
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;
uniform vec3 u_c4;
uniform float u_speed;
uniform float u_energy;

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
  float t = u_time * u_speed * (0.85 + 0.25 * e);

  // Silk swirl: rotate + dual domain warp (energy makes flow livelier)
  float ang = t * (0.12 + 0.08 * (e - 1.0));
  float ca = cos(ang);
  float sa = sin(ang);
  p = mat2(ca, -sa, sa, ca) * p;

  float warp = 0.85 + 0.35 * (e - 1.0);
  float n1 = fbm(p * 2.2 + vec2(t * 0.18, -t * 0.1));
  vec2 q = p + vec2(n1 * warp, fbm(p * 2.0 - t * 0.12) * warp);
  float n2 = fbm(q * 2.6 + vec2(-t * 0.14, t * 0.22));
  vec2 r = q + vec2(n2 * (0.7 + 0.2 * (e - 1.0)), fbm(q * 3.1 + t * 0.11) * 0.7);

  float silk = fbm(r * 2.4 + t * 0.07);
  silk = silk * 0.68 + n2 * 0.32;

  // Soft vignette keeps edges deep green
  float vig = smoothstep(1.35, 0.15, length(p * 1.05));
  silk = mix(silk * 0.35, silk, vig);

  vec3 col = palette(silk);
  // Silk sheen — stronger when energy > 1
  float sheen = (0.04 + 0.05 * (e - 1.0)) * sin(silk * 6.28318 + t * (1.0 + 0.4 * (e - 1.0)));
  col += u_c4 * (sheen + 0.02 + 0.015 * (e - 1.0));
  // Extra sprout flicker for living wash
  col = mix(col, u_c3, 0.06 * (e - 1.0) * (0.5 + 0.5 * sin(t * 1.7 + silk * 4.0)));

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
};

export function VerdantSwirl({
  className = "",
  speed = 1,
  opacity = 1,
  energy = 1,
  maxDpr = 1.75,
  active = true,
}: VerdantSwirlProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
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
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");
    const uC3 = gl.getUniformLocation(program, "u_c3");
    const uC4 = gl.getUniformLocation(program, "u_c4");

    const c1 = hexToRgb(VERDANT_COLORS.deep);
    const c2 = hexToRgb(VERDANT_COLORS.forest);
    const c3 = hexToRgb(VERDANT_COLORS.sprout);
    const c4 = hexToRgb(VERDANT_COLORS.highlight);

    gl.uniform3fv(uC1, c1);
    gl.uniform3fv(uC2, c2);
    gl.uniform3fv(uC3, c3);
    gl.uniform3fv(uC4, c4);
    gl.uniform1f(uSpeed, reduce ? 0 : speed);
    gl.uniform1f(uEnergy, energy);

    let raf = 0;
    let start = performance.now();
    let frozen = reduce || !active;
    let elapsedAtPause = 1.8;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
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
      resize();
      const t = frozen ? elapsedAtPause : (now - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!frozen) raf = requestAnimationFrame(draw);
    };

    resize();
    if (frozen) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(draw);
    }

    const onResize = () => {
      resize();
      if (frozen) draw(performance.now());
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
  }, [reduce, speed, energy, maxDpr, active]);

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
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  speed?: number;
}) {
  return (
    <section
      className={`relative overflow-hidden bg-[#03120E] ${className}`}
    >
      <VerdantSwirl speed={speed} />
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </section>
  );
}
