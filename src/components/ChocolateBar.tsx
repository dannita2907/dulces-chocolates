"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

const TOTAL = 12;
const COLORS = ["#6b3a1f", "#8a4b27", "#e8b66a", "#ff6f91", "#3b1e10"];

interface Shard {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  size: number;
  color: string;
  tri: boolean;
}

const CSS = `
.cb-wrap{position:relative;display:inline-block;perspective:900px}
.cb-bar{
  position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;
  border-radius:16px;background:linear-gradient(145deg,#2a1409,#1a0c06);
  box-shadow:0 26px 50px rgba(0,0,0,.5), inset 0 2px 0 rgba(255,255,255,.08);
  transform:rotateX(14deg) rotateY(-10deg);
  transition:transform .6s cubic-bezier(.2,.8,.2,1);
}
.cb-bar:hover{transform:rotateX(4deg) rotateY(0deg) scale(1.03)}
.cb-shine{position:absolute;inset:0;border-radius:16px;overflow:hidden;pointer-events:none}
.cb-shine::after{
  content:"";position:absolute;top:-20%;bottom:-20%;width:40%;left:-60%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent);
  transform:skewX(-18deg);animation:cb-sweep 4.5s ease-in-out 1.5s infinite;
}
.cb-sq{
  all:unset;box-sizing:border-box;cursor:pointer;
  width:clamp(44px,10vw,70px);aspect-ratio:1;
  animation:cb-drop .9s cubic-bezier(.2,1.5,.4,1) both;
  animation-delay:calc(var(--i) * 80ms);
}
.cb-sq:focus-visible{outline:2px solid #e8b66a;outline-offset:3px;border-radius:12px}
.cb-in{
  display:block;width:100%;height:100%;border-radius:11px;position:relative;
  background:linear-gradient(145deg,#6b3a1f,#4a2514 55%,#341a0d);
  box-shadow:inset 0 3px 3px rgba(255,255,255,.22), inset 0 -5px 8px rgba(0,0,0,.45), 0 4px 8px rgba(0,0,0,.45);
  animation:cb-wave 3.6s ease-in-out infinite;
  animation-delay:calc(var(--i) * -310ms);
  transition:filter .25s, transform .25s, opacity .8s;
}
.cb-in::before{
  content:"";position:absolute;inset:16%;border-radius:7px;
  background:linear-gradient(145deg,#3d1f10,#5b2f19);
  box-shadow:inset 0 3px 5px rgba(0,0,0,.5), inset 0 -2px 2px rgba(255,255,255,.14);
}
.cb-sq:hover .cb-in{filter:brightness(1.25);transform:translateY(-4px) scale(1.05)}
.cb-sq.gone{pointer-events:none}
.cb-sq.gone .cb-in{
  animation:none;opacity:0;
  transform:translate(var(--dx),150px) rotate(var(--rot)) scale(.2);
  transition:transform .8s cubic-bezier(.5,0,1,.6), opacity .8s;
}
.cb-sq.back{animation:cb-drop .8s cubic-bezier(.2,1.5,.4,1) both;animation-delay:0s}
.cb-shard{
  position:absolute;pointer-events:none;
  animation:cb-fly .9s cubic-bezier(.1,.7,.3,1) forwards;
}
.cb-info{margin-top:16px;font-size:.85rem;color:#d9b995}
.cb-count{
  display:inline-block;margin-left:.5em;padding:.05em .7em;min-width:2.2em;border-radius:99px;
  background:rgba(232,182,106,.15);border:1px solid rgba(232,182,106,.35);color:#e8b66a;font-weight:600;
}
@keyframes cb-drop{
  from{opacity:0;transform:translateY(-100px) rotate(-30deg) scale(.4)}
  to{opacity:1;transform:none}
}
@keyframes cb-wave{
  0%,100%{transform:translateY(0) rotate(0)}
  50%{transform:translateY(-5px) rotate(1.2deg)}
}
@keyframes cb-sweep{0%{left:-60%}55%,100%{left:130%}}
@keyframes cb-fly{
  0%{opacity:1;transform:translate(0,0) rotate(0) scale(1)}
  100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--rot)) scale(.3)}
}
@media (prefers-reduced-motion:reduce){
  .cb-sq,.cb-in,.cb-shine::after,.cb-shard{animation-duration:.01ms!important;animation-delay:0s!important;animation-iteration-count:1!important}
}
`;

/** Barra de chocolate interactiva: cada cuadrito se rompe al hacer clic. */
export function ChocolateBar() {
  const [gone, setGone] = useState<boolean[]>(() => Array<boolean>(TOTAL).fill(false));
  const [back, setBack] = useState<boolean[]>(() => Array<boolean>(TOTAL).fill(false));
  const [bites, setBites] = useState(0);
  const [shards, setShards] = useState<Shard[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function setAt(setter: (u: (prev: boolean[]) => boolean[]) => void, i: number, value: boolean) {
    setter((prev) => prev.map((v, k) => (k === i ? value : v)));
  }

  function bite(i: number, e: MouseEvent<HTMLButtonElement>) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const sq = e.currentTarget.getBoundingClientRect();
    const w = wrap.getBoundingClientRect();
    const cx = sq.left - w.left + sq.width / 2;
    const cy = sq.top - w.top + sq.height / 2;

    const fresh: Shard[] = Array.from({ length: 16 }, () => {
      const a = Math.random() * Math.PI * 2;
      const d = 40 + Math.random() * 90;
      return {
        id: idRef.current++,
        x: cx,
        y: cy,
        dx: Math.cos(a) * d,
        dy: Math.sin(a) * d - 30,
        rot: Math.random() * 540 - 270,
        size: 4 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        tri: Math.random() < 0.6,
      };
    });
    const ids = new Set(fresh.map((s) => s.id));
    setShards((prev) => [...prev, ...fresh]);
    later(() => setShards((prev) => prev.filter((s) => !ids.has(s.id))), 1000);

    setAt(setGone, i, true);
    setBites((n) => n + 1);
    later(() => {
      setAt(setGone, i, false);
      setAt(setBack, i, true);
      later(() => setAt(setBack, i, false), 900);
    }, 3200);
  }

  return (
    <div className="inline-flex flex-col items-center">
      <style>{CSS}</style>
      <div className="cb-wrap" ref={wrapRef}>
        <div className="cb-bar">
          <div className="cb-shine" />
          {Array.from({ length: TOTAL }, (_, i) => {
            const style = {
              "--i": i,
              "--dx": `${((i % 3) - 1) * 30}px`,
              "--rot": `${(i % 2 ? 1 : -1) * (30 + i * 6)}deg`,
            } as CSSProperties;
            return (
              <button
                key={i}
                type="button"
                aria-label="Darle un bocado a este cuadrito de chocolate"
                className={`cb-sq${gone[i] ? " gone" : ""}${back[i] ? " back" : ""}`}
                style={style}
                onClick={(e) => bite(i, e)}
              >
                <span className="cb-in" />
              </button>
            );
          })}
        </div>
        {shards.map((s) => (
          <span
            key={s.id}
            className="cb-shard"
            style={
              {
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                background: s.color,
                borderRadius: s.tri ? 0 : "50%",
                clipPath: s.tri ? "polygon(50% 0, 100% 100%, 0 85%)" : undefined,
                "--dx": `${s.dx}px`,
                "--dy": `${s.dy}px`,
                "--rot": `${s.rot}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <p className="cb-info">
        Haz clic en los cuadritos para darles un bocado 🍫
        <span className="cb-count" aria-live="polite">
          {bites}
        </span>
      </p>
    </div>
  );
}
