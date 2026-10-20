"use client";

import { useEffect, useRef } from "react";
import { CHAPTERS, TICKER } from "@/lib/content";
import { createFilmRenderer } from "./filmRenderer";
import { OpenProjectButton } from "./controls";

/* Scroll-driven hero: a tall section with a sticky canvas stage. Scroll progress maps to chapter 0..5;
   panels and chapter tabs are updated directly in the animation loop so React never re-renders per frame. */
export default function Film() {
  const filmRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = CHAPTERS.length - 1;

  useEffect(() => {
    const film = filmRef.current!, root = getComputedStyle(document.documentElement);
    const film$ = createFilmRenderer(canvasRef.current!, {
      body: root.getPropertyValue("--font-inter") || "Inter",
      display: root.getPropertyValue("--font-display") || "Space Grotesk",
    });
    const span = () => film.offsetHeight - innerHeight;
    let cs = 0, raf = 0;
    const frame = (tm: number) => {
      const r = film.getBoundingClientRect();
      const tg = Math.max(0, Math.min(1, -r.top / span())) * last;
      cs += (tg - cs) * 0.09;
      if (Math.abs(tg - cs) < 0.0005) cs = tg;
      if (r.bottom > 0 && r.top < innerHeight) {
        film$.draw(cs, tm / 1000);
        panelRefs.current.forEach((p, i) => {
          if (!p) return;
          const d = cs - i, op = Math.max(0, Math.min(1, 1.7 - Math.abs(d) * 3.4));
          p.style.opacity = String(op);
          p.style.setProperty("--y", -d * 60 + "px");
          p.style.pointerEvents = op > 0.5 ? "auto" : "none";
          p.inert = op < 0.5;
        });
        const a = Math.round(cs);
        tabRefs.current.forEach((b, i) => {
          b?.classList.toggle("on", i == a);
          b?.setAttribute("aria-selected", String(i == a));
        });
      }
      raf = requestAnimationFrame(frame);
    };
    addEventListener("resize", film$.resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", film$.resize);
    };
  }, [last]);

  const jump = (i: number) => {
    const film = filmRef.current!;
    scrollTo({ top: film.offsetTop + (i / last) * (film.offsetHeight - innerHeight) + 2, behavior: "smooth" });
  };

  return (
    <div className="film" ref={filmRef}>
      <div className="stage">
        <canvas ref={canvasRef} aria-hidden="true" />
        <div>
          {CHAPTERS.map((c, i) => {
            const H = i ? "h2" : "h1";
            return (
              <div className="pn" key={c.tab} ref={(el) => { panelRefs.current[i] = el; }}>
                <H>{c.title}</H>
                <p>{c.body}</p>
                <ul className="tg">{c.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                {c.more ? (
                  <details><summary>More about this step</summary><p>{c.more}</p></details>
                ) : (
                  <>
                    <div className="row">
                      <OpenProjectButton>Start your project</OpenProjectButton>
                      <a className="btn ghost" href="#services">Explore services</a>
                    </div>
                    <div className="hint"><i />Scroll to watch it get built</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="cb" role="tablist" aria-label="Chapters">
          {CHAPTERS.map((c, i) => (
            <button key={c.tab} role="tab" aria-selected={false} ref={(el) => { tabRefs.current[i] = el; }} onClick={() => jump(i)}>{c.tab}</button>
          ))}
        </div>
        <div className="ticker" aria-label="Services and technologies">
          <div>{[...TICKER, ...TICKER].map((t, i) => <span key={i} aria-hidden={i >= TICKER.length || undefined}>{t}</span>)}</div>
        </div>
      </div>
    </div>
  );
}
