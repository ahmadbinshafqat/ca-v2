"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useSite } from "./SiteProvider";

export function OpenProjectButton({ children, className = "btn", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const { openProject } = useSite();
  return <button className={className} style={style} onClick={openProject}>{children}</button>;
}

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      ref.current!.style.width = (scrollY / (h.scrollHeight - innerHeight)) * 100 + "%";
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);
  return <div className="prog" ref={ref} />;
}
