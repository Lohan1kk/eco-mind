"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  useDocumentVisible,
  usePerfProfile,
} from "@/components/hooks/usePerfProfile";
import { createFrameGate } from "@/lib/performance";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  initialSize: number;

  constructor(x: number, y: number, boost = 1) {
    this.x = x;
    this.y = y;
    this.size = (Math.random() * 5 + 2) * boost;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = -Math.random() * 3 - 1;
    this.life = 100;
    this.initialSize = this.size;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1.2;
    this.size = Math.max(0, this.initialSize * (this.life / 100));
  }
}

/**
 * Site-wide green smoke trail that follows pointer / touch.
 * Non-interactive overlay (does not block clicks).
 * Disabled or lightened on weaker devices via PerfProfile.
 */
export function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();
  const perf = usePerfProfile();
  const docVisible = useDocumentVisible();
  const enabled = !reduce && perf.smokeCursor && docVisible;

  useEffect(() => {
    if (!enabled) {
      particlesRef.current = [];
      document.documentElement.classList.remove("smoke-cursor-on");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const maxParticles = perf.smokeMaxParticles;
    const softCap = Math.max(40, Math.floor(maxParticles * 0.72));
    const dprCap = perf.tier === "high" ? 2 : 1;
    const shouldDraw = createFrameGate(perf.tier === "high" ? 60 : 30);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, count: number, boost = 1) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(
          new Particle(
            x + (Math.random() * 10 - 5),
            y + (Math.random() * 10 - 5),
            boost,
          ),
        );
      }
      if (particlesRef.current.length > maxParticles) {
        particlesRef.current = particlesRef.current.slice(-softCap);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      const isTouch = e.pointerType === "touch";
      spawn(
        e.clientX,
        e.clientY,
        isTouch ? perf.smokeSpawnTouch : perf.smokeSpawnDesktop,
        isTouch ? 1.15 : 1,
      );
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
      spawn(e.clientX, e.clientY, Math.min(3, perf.smokeSpawnTouch + 1), 1.2);
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const animate = (now: number) => {
      rafRef.current = requestAnimationFrame(animate);
      if (!shouldDraw(now)) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const next: Particle[] = [];
      for (const p of particlesRef.current) {
        p.update();
        if (p.life <= 0 || p.size <= 0) continue;
        next.push(p);
        const opacity = (p.life / 100) * 0.5;
        ctx.fillStyle = `rgba(47, 122, 79, ${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        // Second highlight pass only on high tier — halves path cost on phones
        if (perf.tier === "high") {
          ctx.fillStyle = `rgba(200, 239, 212, ${opacity * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y - p.size * 0.2, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      particlesRef.current = next;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.documentElement.classList.add("smoke-cursor-on");
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.documentElement.classList.remove("smoke-cursor-on");
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, perf]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  );
}
