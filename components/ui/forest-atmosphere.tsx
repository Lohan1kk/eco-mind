"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useReducedMotion } from "framer-motion";
import {
  useDocumentVisible,
  usePerfProfile,
} from "@/components/hooks/usePerfProfile";
import { createFrameGate } from "@/lib/performance";

/**
 * Atmospheric forest mist + god-ray shader for EcoMind hero.
 * Transparent WebGL overlay — reads pointer from a ref (no React re-renders).
 * Quality scales with PerfProfile (DPR + FPS); skipped on low-tier devices.
 */
const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;
uniform vec2 u_pointer;
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
    p = m * p * 1.05;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.12;
  vec2 drift = p + u_pointer * 0.22;

  float mist = fbm(drift * 1.8 + vec2(t * 0.35, -t * 0.2));
  mist = mist * 0.65 + fbm(drift * 3.2 - vec2(t * 0.15, t * 0.25)) * 0.35;

  vec2 rayOrigin = vec2(0.42, -0.55) + u_pointer * 0.08;
  vec2 toRay = drift - rayOrigin;
  float ang = atan(toRay.y, toRay.x);
  float rays = pow(max(0.0, cos(ang * 7.0 + t * 0.4)), 3.0);
  rays *= smoothstep(1.2, 0.15, length(toRay));
  rays *= 0.55 + 0.45 * mist;

  vec3 deep = vec3(0.012, 0.071, 0.055);
  vec3 forest = vec3(0.055, 0.486, 0.353);
  vec3 sprout = vec3(0.486, 0.898, 0.467);
  vec3 light = vec3(0.957, 1.0, 0.78);

  float fogBody = smoothstep(0.25, 0.85, mist);
  vec3 fogColor = mix(forest, sprout, fogBody * 0.55);
  fogColor = mix(fogColor, light, rays * 0.65);

  float leftVeil = smoothstep(0.85, 0.05, uv.x);
  float alpha = fogBody * 0.22 * u_intensity;
  alpha += rays * 0.18 * u_intensity;
  alpha += leftVeil * mist * 0.12 * u_intensity;
  alpha = clamp(alpha, 0.0, 0.55);

  vec3 col = mix(deep, fogColor, 0.85 + rays * 0.15);
  gl_FragColor = vec4(col, alpha);
}
`;

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

type Pointer = { x: number; y: number };

type ForestAtmosphereProps = {
  className?: string;
  intensity?: number;
  /** Shared ref updated by Hero without React setState */
  pointerRef?: MutableRefObject<Pointer>;
  active?: boolean;
};

/** Soft CSS mist when WebGL is skipped — same palette, no GPU loop. */
function ForestCssFallback({
  className,
  intensity,
}: {
  className: string;
  intensity: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity: Math.min(0.85, 0.45 + intensity * 0.4),
        background: `
          radial-gradient(ellipse 70% 55% at 18% 40%, rgba(14, 124, 90, 0.35), transparent 60%),
          radial-gradient(ellipse 50% 45% at 72% 18%, rgba(124, 229, 119, 0.18), transparent 55%),
          linear-gradient(105deg, rgba(10, 22, 16, 0.35) 0%, transparent 55%)
        `,
      }}
    />
  );
}

export function ForestAtmosphere({
  className = "",
  intensity = 1,
  pointerRef,
  active = true,
}: ForestAtmosphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const perf = usePerfProfile();
  const docVisible = useDocumentVisible();
  const localPointer = useRef<Pointer>({ x: 0, y: 0 });
  const intensityRef = useRef(intensity);
  const activeRef = useRef(active && docVisible);

  useEffect(() => {
    intensityRef.current = intensity;
    activeRef.current = active && docVisible;
  }, [intensity, active, docVisible]);

  const useWebgl = !reduce;

  useEffect(() => {
    if (!useWebgl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "default",
    });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

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
    const uIntensity = gl.getUniformLocation(program, "u_intensity");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uOctaves = gl.getUniformLocation(program, "u_octaves");

    const octaves = perf.tier === "low" ? 3 : 5;
    gl.uniform1f(uOctaves, octaves);

    let raf = 0;
    const start = performance.now();
    const frozen = Boolean(reduce);
    const shouldDraw = createFrameGate(perf.forestTargetFps);
    let lastW = 0;
    let lastH = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, perf.forestMaxDpr);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const pw = Math.max(1, Math.floor(w * dpr));
      const ph = Math.max(1, Math.floor(h * dpr));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
        gl.viewport(0, 0, pw, ph);
        gl.uniform2f(uRes, pw, ph);
        lastW = pw;
        lastH = ph;
      } else if (lastW !== pw || lastH !== ph) {
        gl.viewport(0, 0, pw, ph);
        gl.uniform2f(uRes, pw, ph);
        lastW = pw;
        lastH = ph;
      }
    };

    const draw = (now: number) => {
      if (!frozen) raf = requestAnimationFrame(draw);
      if (!activeRef.current && !frozen) return;
      if (!frozen && !shouldDraw(now)) return;

      resize();
      const ptr = pointerRef?.current ?? localPointer.current;
      const t = frozen ? 2.4 : (now - start) / 1000;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uIntensity, intensityRef.current);
      gl.uniform2f(uPointer, ptr.x, ptr.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    resize();
    if (frozen) draw(performance.now());
    else raf = requestAnimationFrame(draw);

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
  }, [reduce, pointerRef, useWebgl, perf.forestMaxDpr, perf.forestTargetFps, perf.tier]);

  if (!useWebgl) {
    return (
      <ForestCssFallback className={className} intensity={intensity} />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
