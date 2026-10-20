"use client";

import type { PointerEvent } from "react";
import { SERVICES } from "@/lib/content";

/* the card glow follows the pointer via --mx/--my */
const track = (e: PointerEvent<HTMLDivElement>) => {
  const c = e.currentTarget, r = c.getBoundingClientRect();
  c.style.setProperty("--mx", e.clientX - r.left + "px");
  c.style.setProperty("--my", e.clientY - r.top + "px");
};

export default function ServiceGrid() {
  return (
    <div className="grid">
      {SERVICES.map((s) => (
        <div className="sv" key={s.title} onPointerMove={track}>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
          <ul>{s.points.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
