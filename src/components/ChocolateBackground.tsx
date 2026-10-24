"use client";

import { useEffect, useRef } from "react";

type Kind = "bean" | "piece" | "sprinkle" | "heart";

interface Part {
  kind: Kind;
  x: number;
  y: number;
  s: number;
  depth: number;
  vy: number;
  sway: number;
  ph: number;
  rot: number;
  vr: number;
  color: string;
  a: number;
}
interface Drip {
  x: number;
  w: number;
  base: number;
  phase: number;
  speed: number;
  len: number;
  cooldown: number;
}
interface Drop {
  x: number;
  y: number;
  r: number;
  vy: number;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  g: number;
  s: number;
  c: string;
  rot: number;
  vr: number;
}

const KINDS: Kind[] = ["bean", "piece", "sprinkle", "heart", "bean", "piece"];
const SPRINKLE_COLORS = ["#ff6f91", "#ffd166", "#fff3d2", "#9be7c4", "#e8b66a"];
const BAND = 30;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Fondo animado de chocolate para la portada.
 * Se coloca dentro de un contenedor con `relative overflow-hidden`.
 */
export function ChocolateBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const context = cv.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;
    const host = cv.parentElement;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let mx = 0;
    let drips: Drip[] = [];
    let drops: Drop[] = [];
    let parts: Part[] = [];
    const sparks: Spark[] = [];
    let raf = 0;

    function rr(x: number, y: number, w: number, h: number, r: number) {
      const rad = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rad, y);
      ctx.arcTo(x + w, y, x + w, y + h, rad);
      ctx.arcTo(x + w, y + h, x, y + h, rad);
      ctx.arcTo(x, y + h, x, y, rad);
      ctx.arcTo(x, y, x + w, y, rad);
      ctx.closePath();
    }

    function makePart(initial: boolean): Part {
      const depth = rand(0.4, 1.2);
      return {
        kind: KINDS[Math.floor(Math.random() * KINDS.length)] as Kind,
        x: rand(0, W),
        y: initial ? rand(0, H) : rand(-60, -10),
        s: rand(8, 18) * depth,
        depth,
        vy: rand(0.3, 1.1) * depth,
        sway: rand(0.4, 1.4),
        ph: rand(0, 6.28),
        rot: rand(0, 6.28),
        vr: rand(-0.025, 0.025),
        color: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)]!,
        a: rand(0.4, 0.9) * Math.min(1, depth + 0.2),
      };
    }

    function initDrips() {
      drips = [];
      const step = W < 600 ? 34 : 48;
      for (let x = -10; x < W + 20; x += step) {
        drips.push({
          x: x + rand(-10, 10),
          w: rand(13, 26),
          base: rand(22, W < 600 ? 70 : 110),
          phase: rand(0, 6.28),
          speed: rand(0.35, 0.8),
          len: 0,
          cooldown: rand(0, 4),
        });
      }
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = host!.clientWidth;
      H = host!.clientHeight;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDrips();
      const target = Math.round(Math.min(60, Math.max(18, (W * H) / 20000)));
      const next: Part[] = [];
      for (let i = 0; i < target; i++) next.push(parts[i] ?? makePart(true));
      parts = next;
    }

    function drawBean(s: number) {
      const g = ctx.createRadialGradient(-s * 0.3, -s * 0.3, 1, 0, 0, s);
      g.addColorStop(0, "#9a5a30");
      g.addColorStop(1, "#3b1e10");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, s, s * 0.62, 0, 0, 6.28);
      ctx.fill();
      ctx.strokeStyle = "rgba(20,8,3,.75)";
      ctx.lineWidth = Math.max(1, s * 0.1);
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, 0);
      ctx.quadraticCurveTo(0, s * 0.3, s * 0.8, 0);
      ctx.stroke();
    }
    function drawPiece(s: number) {
      const g = ctx.createLinearGradient(-s, -s, s, s);
      g.addColorStop(0, "#7a4424");
      g.addColorStop(1, "#2d160b");
      ctx.fillStyle = g;
      rr(-s * 0.8, -s * 0.8, s * 1.6, s * 1.6, s * 0.3);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.22)";
      rr(-s * 0.62, -s * 0.62, s * 1.0, s * 0.28, s * 0.14);
      ctx.fill();
    }
    function drawSprinkle(s: number, c: string) {
      ctx.fillStyle = c;
      rr(-s * 0.2, -s * 0.7, s * 0.4, s * 1.4, s * 0.2);
      ctx.fill();
    }
    function drawHeart(s: number) {
      ctx.fillStyle = "#ff6f91";
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 1.1, -s * 0.4, -s * 0.45, -s * 1.05, 0, -s * 0.4);
      ctx.bezierCurveTo(s * 0.45, -s * 1.05, s * 1.1, -s * 0.4, 0, s * 0.35);
      ctx.fill();
    }

    function drawMelt(t: number) {
      const grad = ctx.createLinearGradient(0, 0, 0, BAND + 130);
      grad.addColorStop(0, "#4a2514");
      grad.addColorStop(0.4, "#6b3a1f");
      grad.addColorStop(1, "#3a1c0e");
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      for (let x = W; x >= 0; x -= 20) {
        ctx.lineTo(x, BAND + Math.sin(x * 0.025 + t * 1.2) * 5);
      }
      ctx.closePath();
      ctx.fill();

      for (const d of drips) {
        const target = d.base * (0.55 + 0.45 * Math.sin(t * d.speed + d.phase));
        d.len += (target - d.len) * 0.06;
        const top = BAND - 6;
        const h = d.len;
        ctx.fillStyle = grad;
        rr(d.x - d.w / 2, top, d.w, h, d.w / 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(d.x, top + h, d.w * 0.62, 0, 6.28);
        ctx.fill();
        ctx.fillStyle = "rgba(255,225,190,.22)";
        rr(d.x - d.w * 0.28, top + 4, d.w * 0.16, Math.max(6, h * 0.7), 4);
        ctx.fill();

        d.cooldown -= 1 / 60;
        if (d.cooldown <= 0 && d.len > d.base * 0.8 && !reduce) {
          drops.push({ x: d.x, y: top + h, r: d.w * 0.5, vy: 0 });
          d.cooldown = rand(3, 9);
          d.len *= 0.6;
        }
      }
      ctx.fillStyle = "rgba(255,225,190,.14)";
      ctx.fillRect(0, 6, W, 3);
    }

    function drawDrops() {
      drops = drops.filter((d) => {
        d.vy += 0.35;
        d.y += d.vy;
        ctx.fillStyle = "#5a2e18";
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, d.r * 0.8, d.r * 1.2, 0, 0, 6.28);
        ctx.fill();
        ctx.fillStyle = "rgba(255,225,190,.3)";
        ctx.beginPath();
        ctx.arc(d.x - d.r * 0.25, d.y - d.r * 0.3, d.r * 0.22, 0, 6.28);
        ctx.fill();
        return d.y < H + 20;
      });
    }

    function onMove(e: PointerEvent) {
      const r = host!.getBoundingClientRect();
      mx = e.clientX - r.left;
      if (reduce) return;
      const my = e.clientY - r.top;
      for (let i = 0; i < 2; i++) {
        sparks.push({
          x: mx + rand(-6, 6),
          y: my + rand(-6, 6),
          vx: rand(-0.8, 0.8),
          vy: rand(-0.6, 1.2),
          life: 1,
          decay: rand(0.025, 0.045),
          g: 0.04,
          s: rand(2, 4.5),
          c: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)]!,
          rot: 0,
          vr: 0,
        });
      }
    }

    const t0 = performance.now();
    function frame(now: number) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      parts.forEach((p, i) => {
        if (!reduce) {
          p.y += p.vy;
          p.rot += p.vr;
        }
        const px = p.x + Math.sin(t * p.sway + p.ph) * 22 + (mx - W / 2) * 0.02 * p.depth;
        if (p.y > H + 40) parts[i] = makePart(false);
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.translate(px, p.y);
        ctx.rotate(p.rot);
        if (p.kind === "bean") drawBean(p.s);
        else if (p.kind === "piece") drawPiece(p.s);
        else if (p.kind === "sprinkle") drawSprinkle(p.s, p.color);
        else drawHeart(p.s * 0.7);
        ctx.restore();
      });

      drawMelt(t);
      drawDrops();

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.vy += s.g;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, 6.28);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    host.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}