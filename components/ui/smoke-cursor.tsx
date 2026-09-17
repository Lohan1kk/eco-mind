"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useLowPowerMode } from "@/hooks/useLowPowerMode";

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
 * Desktop-only green smoke trail. Disabled on phones / low-power devices
 * so touch scrolling and GPU stay free.
 */
export function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const idleRef = useRef(true);
  const reduce = useReducedMotion();
  const lowPower = useLowPowerMode();
  const disabled = Boolean(reduce || lowPower);

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      if (particlesRef.current.length > 120) {
        particlesRef.current = particlesRef.current.slice(-90);
      }
      if (idleRef.current) {
        idleRef.current = false;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      spawn(e.clientX, e.clientY, 2, 1);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      spawn(e.clientX, e.clientY, 3, 1.1);
    };

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current = particlesRef.current
        .filter((p) => p.life > 0 && p.size > 0)
        .map((p) => {
          p.update();
          if (p.size > 0) {
            const opacity = (p.life / 100) * 0.5;
            ctx.fillStyle = `rgba(47, 122, 79, ${opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(200, 239, 212, ${opacity * 0.4})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y - p.size * 0.2, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          return p;
        });

      if (particlesRef.current.length === 0) {
        idleRef.current = true;
        rafRef.current = undefined;
        return;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.documentElement.classList.add("smoke-cursor-on");

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.documentElement.classList.remove("smoke-cursor-on");
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  );
}
