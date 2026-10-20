"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACT_EMAIL, PROJECT_OPTIONS } from "@/lib/content";

/* 3-step project inquiry, then a thank-you pane (step 3) */
export default function ProjectModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [when, setWhen] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key == "Escape") onClose(); };
    addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const go = (n: number) => { setStep(n); setErr(""); };
  const toggleNeed = (x: string) => setNeeds((n) => (n.includes(x) ? n.filter((y) => y != x) : [...n, x]));

  /* email the request via FormSubmit (no backend of our own) */
  async function send() {
    setSending(true);
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "New project request from " + name.trim(),
          _template: "table",
          name: name.trim(),
          email: email.trim(),
          services: needs.join(", "),
          budget: budget || "Not specified",
          launch: when || "Not specified",
          message: desc.trim() || "(none)",
        }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) != "true") throw new Error(j.message || "HTTP " + r.status);
      go(3);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("FormSubmit:", msg);
      setErr(`Couldn't send your request (${msg}). Please try again, or email ${CONTACT_EMAIL} directly.`);
    } finally {
      setSending(false);
    }
  }

  function next() {
    if (step == 0 && !needs.length) return setErr("Pick at least one service so we can route your request.");
    if (step == 2) {
      if (!name.trim()) return setErr("Enter your name.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email, like name@company.com.");
      return send();
    }
    if (step == 3) return onClose();
    go(step + 1);
  }

  const opts = (list: string[], on: (x: string) => boolean, pick: (x: string) => void) => (
    <div className="opts">
      {list.map((x) => (
        <button key={x} type="button" className={on(x) ? "on" : undefined} onClick={() => pick(x)}>{x}</button>
      ))}
    </div>
  );

  return (
    <div className="ov open" role="dialog" aria-modal="true" aria-labelledby="mt" onClick={(e) => { if (e.target == e.currentTarget) onClose(); }}>
      <div className="md">
        <button className="x" ref={closeRef} aria-label="Close" onClick={onClose}>&times;</button>
        <h2 id="mt">{step == 3 ? "Thank you" : "Start a project"}</h2>
        <div className="steps">{[0, 1, 2].map((i) => <i key={i} className={i <= Math.min(step, 2) ? "on" : undefined} />)}</div>
        {step == 0 && (
          <div className="pane on">
            <label style={{ marginTop: 0 }}>What do you need? Pick any that apply.</label>
            {opts(PROJECT_OPTIONS.needs, (x) => needs.includes(x), toggleNeed)}
          </div>
        )}
        {step == 1 && (
          <div className="pane on">
            <label style={{ marginTop: 0 }}>Budget range</label>
            {opts(PROJECT_OPTIONS.budgets, (x) => x == budget, setBudget)}
            <label>When do you want to launch?</label>
            {opts(PROJECT_OPTIONS.timelines, (x) => x == when, setWhen)}
          </div>
        )}
        {step == 2 && (
          <div className="pane on">
            <label htmlFor="nm" style={{ marginTop: 0 }}>Your name</label>
            <input id="nm" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            <label htmlFor="em">Work email</label>
            <input id="em" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="ds">What are you building?</label>
            <textarea id="ds" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
        )}
        {step == 3 && (
          <div className="pane on">
            <h3>Request sent</h3>
            <p style={{ marginTop: 10 }}>Thanks, <b>{name}</b>. We&apos;ll reply to <b>{email}</b> within 1 business day.</p>
          </div>
        )}
        <div className="err" role="alert">{err}</div>
        <div className="foot">
          <button className="btn ghost" style={{ visibility: step == 0 || step == 3 ? "hidden" : "visible" }} disabled={sending} onClick={() => go(step - 1)}>Back</button>
          <button className="btn" disabled={sending} onClick={next}>
            {sending ? "Sending..." : step == 2 ? "Send request" : step == 3 ? "Close" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
