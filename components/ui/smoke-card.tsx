"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  initialSize: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4.5 + 1.5;
    this.speedX = Math.random() * 1.4 - 0.7;
    this.speedY = -Math.random() * 2.4 - 0.6;
    this.life = 100;
    this.initialSize = this.size;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1.15;
    this.size = Math.max(0, this.initialSize * (this.life / 100));
  }
}

type SmokeCardProps = {
  className?: string;
};

/**
 * Interactive mist/smoke canvas — EcoMind green palette.
 * Desktop: follows pointer. Mobile: soft center plume.
 */
export function SmokeCard({ className = "" }: SmokeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0, active: false });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();

    if (reduce) {
      // Static soft mist — no animation when reduced motion is on
      const rect = canvas.getBoundingClientRect();
      const g = ctx.createRadialGradient(
        rect.width * 0.5,
        rect.height * 0.7,
        8,
        rect.width * 0.5,
        rect.height * 0.45,
        rect.width * 0.45,
      );
      g.addColorStop(0, "rgba(200, 239, 212, 0.35)");
      g.addColorStop(0.55, "rgba(47, 122, 79, 0.18)");
      g.addColorStop(1, "rgba(22, 61, 42, 0)");
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, rect.width, rect.height);
      window.addEventListener("resize", updateCanvasSize);
      return () => window.removeEventListener("resize", updateCanvasSize);
    }

    let tick = 0;

    const spawn = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(
          new Particle(x + (Math.random() * 10 - 5), y + (Math.random() * 10 - 5)),
        );
      }
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      tick += 1;

      particlesRef.current = particlesRef.current
        .filter((particle) => particle.life > 0 && particle.size > 0)
        .map((particle) => {
          particle.update();
          if (particle.size > 0) {
            const opacity = (particle.life / 100) * 0.55;
            // EcoMind greens: sprout → forest-mid
            ctx.fillStyle = `rgba(61, 154, 95, ${opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = `rgba(200, 239, 212, ${opacity * 0.45})`;
            ctx.beginPath();
            ctx.arc(
              particle.x,
              particle.y - particle.size * 0.2,
              particle.size * 0.55,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
          return particle;
        });

      if (mousePosRef.current.active) {
        spawn(mousePosRef.current.x, mousePosRef.current.y, 2);
      } else if (tick % 3 === 0) {
        // Gentle ambient plume (works without hover / on touch)
        spawn(rect.width * 0.5, rect.height * 0.72, 1);
      }

      // Cap particles for performance
      if (particlesRef.current.length > 180) {
        particlesRef.current = particlesRef.current.slice(-140);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", updateCanvasSize);
    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reduce]);

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: 0, y: 0, active: false };
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-sprout/20 bg-forest shadow-[inset_0_0_60px_rgba(200,239,212,0.08)] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_85%,rgba(47,122,79,0.45),transparent_55%)]"
      />
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 h-full w-full cursor-crosshair"
        aria-hidden
      />
    </div>
  );
}
