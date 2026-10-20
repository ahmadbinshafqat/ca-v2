"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import ProjectModal from "./ProjectModal";

type Site = {
  openProject: () => void;
};

const SiteContext = createContext<Site | null>(null);

export function useSite() {
  const site = useContext(SiteContext);
  if (!site) throw new Error("useSite must be used inside <SiteProvider>");
  return site;
}

export default function SiteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);

  const openProject = useCallback(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  const closeProject = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus();
  }, []);

  return (
    <SiteContext.Provider value={{ openProject }}>
      {children}
      {open && <ProjectModal onClose={closeProject} />}
    </SiteContext.Provider>
  );
}
