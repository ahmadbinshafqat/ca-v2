import { WORKFLOW as UC } from "@/lib/content";

/* Canvas renderer for the hero "film". draw(c, tm) paints chapter progress c (0..5) at time tm (seconds).
   Coordinates are in scene units: (0,0) is the scene centre and S pixels make one unit. */

type Tone = "w" | "b" | "l" | "m" | "k" | "a";
type Pt = [number, number];

const RG: Record<Tone, string> = { w: "238,243,251", b: "47,107,255", l: "182,255,59", m: "154,167,194", k: "20,28,58", a: "255,176,64" };
const rg = (c: Tone, a = 1) => `rgba(${RG[c]},${a})`;
const sm = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const cl = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lp = (a: number, b: number, t: number) => a + (b - a) * t;

export function createFilmRenderer(cv: HTMLCanvasElement, fonts: { body: string; display: string }) {
  const ctx = cv.getContext("2d")!;
  const BODY = fonts.body, DISP = fonts.display;
  let W = 0, H = 0, cx = 0, cy = 0, S = 1, WIDE = false, NW = 0, NH = 0;
  let NP: Pt[] = [];
  let LB = { x0: -0.9, x1: 0.9, y0: 0.4 };

  /* panelTop: on narrow screens, the y (px) where the text panels begin; the scene is fitted above it */
  function resize(panelTop = H * 0.62) {
    const dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    WIDE = W > 860;
    if (WIDE) { cx = W * 0.68; cy = H * 0.44; S = Math.min(W * 0.3, H * 0.4); }
    else {
      /* the narrow scene spans about -0.72..0.98 units vertically (node row to lower band) */
      const top = 60 + 10, room = Math.max(0, panelTop - 10 - top);
      S = Math.max(40, Math.min(W * 0.44, H * 0.22, room / 1.7));
      cx = W / 2; cy = top + Math.max(0, room - 1.7 * S) / 2 + 0.72 * S;
    }
    NW = WIDE ? 0.29 : 0.54; NH = WIDE ? 0.2 : 0.26;
    NP = [];
    for (let i = 0; i < 6; i++) {
      if (WIDE) NP.push([-0.84 + i * 0.336, 0]);
      else { const r = i > 2 ? 1 : 0; NP.push([-0.62 + (r ? 5 - i : i) * 0.62, r ? -0.1 : -0.55]); }
    }
    NP.push(WIDE ? [NP[4][0], -0.42] : [NP[4][0], 0.3]);
    LB = WIDE ? { x0: -0.9, x1: 0.9, y0: 0.4 } : { x0: -0.9, x1: 0.9, y0: 0.52 };
  }

  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
  };

  function bx(u: number, v: number, w: number, h: number, f: string | null, s: string | null, a = 1, lw = 1.5) {
    const x = cx + u * S, y = cy + v * S, pw = w * S, ph = h * S;
    ctx.globalAlpha = a;
    rr(x - pw / 2, y - ph / 2, pw, ph, Math.min(10, ph / 2.2));
    if (f) { ctx.fillStyle = f; ctx.fill(); }
    if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  function tx(t: string, u: number, v: number, c: Tone = "w", a = 1, sz = 0.034, al: CanvasTextAlign = "center", wt = 500, ff = BODY) {
    ctx.globalAlpha = a;
    ctx.fillStyle = rg(c);
    ctx.font = `${wt} ${Math.max(10, sz * S)}px ${ff},sans-serif`;
    ctx.textAlign = al;
    ctx.textBaseline = "middle";
    ctx.fillText(t, cx + u * S, cy + v * S);
    ctx.globalAlpha = 1;
  }

  /* chapter 0: sources converge into a requirements spec, which then shrinks away */
  function brief(c: number, tm: number) {
    const cv0 = sm(c / 0.35), m = sm((c - 0.35) / 0.45);
    const [eu, ev] = WIDE ? [-0.78, -0.68] : [-0.6, -0.8];
    const dw = lp(WIDE ? 0.95 : 1.4, 0.34, m), dh = lp(0.9, 0.1, m), u = lp(0, eu, m), v = lp(0, ev, m);
    /* highest a source chip may float: its top edge stays 16px below the 60px nav bar */
    const top = (60 + 16 - cy) / S + 0.045 + 0.02;
    if (cv0 < 1)
      [[-0.95, -0.55], [0.88, -0.6], [-0.95, 0.4], [0.9, 0.45], [0, -0.92]].forEach((p, i) => {
        const t = sm(cv0 * 1.1 - i * 0.04);
        const x = lp(p[0], 0, t) + Math.sin(tm * 0.8 + i * 2) * 0.02, y = lp(Math.max(p[1], top), 0, t) + Math.cos(tm * 0.7 + i) * 0.02;
        const a = 1 - sm((cv0 - 0.7) / 0.3);
        ctx.strokeStyle = rg("w", 0.12 * a);
        ctx.beginPath(); ctx.moveTo(cx + x * S, cy + y * S); ctx.lineTo(cx, cy); ctx.stroke();
        bx(x, y, WIDE ? 0.3 : 0.36, 0.09, rg("k", 0.9), rg("w", 0.6), a);
        tx(UC.sources[i], x, y, "w", a, 0.03);
      });
    if (m < 1) {
      /* card and contents fade together; contents are clipped to the shrinking card so nothing spills out */
      const a = 1 - m;
      bx(u, v, dw, dh, rg("k", 0.95), rg("w", 0.35 + 0.5 * cv0), a);
      ctx.save();
      rr(cx + (u - dw / 2) * S, cy + (v - dh / 2) * S, dw * S, dh * S, Math.min(10, (dh * S) / 2.2));
      ctx.clip();
      tx("Requirements spec", u, v - dh / 2 + 0.08, "w", a, 0.042, "center", 600, DISP);
      ["Goals", "Systems and APIs", "Data access", "Risk and guardrails", "Success metrics"].forEach((t, i) => {
        const k = sm((cv0 - 0.1 - i * 0.14) / 0.15), y = v - dh / 2 + 0.2 + i * 0.135;
        bx(u - dw / 2 + 0.1, y, 0.06, 0.06, k > 0 ? rg("l", 0.95 * k) : null, rg("w", 0.5), a, 1.2);
        tx(t, u - dw / 2 + 0.17, y, "w", a, 0.035, "left");
      });
      ctx.restore();
    }
  }

  /* the workflow graph: nodes, edges, tool chips */
  function pipe(c: number) {
    const pp = sm((c - 4.3) / 0.3);
    [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [6, 5]].forEach(([a, b], j) => {
      const t = sm((c - (0.6 + j * 0.07)) / 0.22);
      if (t <= 0) return;
      const A = NP[a], B = NP[b];
      ctx.strokeStyle = pp > 0 ? rg("l", 0.25 + 0.3 * pp) : rg("w", 0.3);
      ctx.lineWidth = 1.5;
      ctx.setLineDash(j >= 5 ? [5, 5] : []);
      ctx.beginPath(); ctx.moveTo(cx + A[0] * S, cy + A[1] * S); ctx.lineTo(cx + lp(A[0], B[0], t) * S, cy + lp(A[1], B[1], t) * S); ctx.stroke();
      ctx.setLineDash([]);
    });
    NP.forEach((p, i) => {
      const a = sm((c - (0.55 + i * 0.07)) / 0.2);
      if (a <= 0) return;
      const bl = sm((c - (1.6 + i * 0.07)) / 0.2), sc = lp(0.85, 1, a), k = i == 6 ? 0.8 : 1, w = NW * sc * k, h = NH * sc * k;
      bx(p[0], p[1], w, h, bl > 0 ? rg("b", 0.9 * bl) : rg("k", 0.9), pp > 0 && i < 6 ? rg("l", 0.9) : rg("w", 0.7), a, 1.5 + pp);
      if (bl > 0 && bl < 1) {
        ctx.globalAlpha = (1 - bl) * a; ctx.strokeStyle = rg("l"); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx + p[0] * S, cy + p[1] * S, NW * S * 0.62 * (1 + bl * 0.4), 0, 6.283); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      tx(UC.nodes[i], p[0], p[1], "w", a);
      if (WIDE && i < 6) {
        const ch = sm((c - (1.7 + i * 0.07)) / 0.2) * (1 - sm((c - 2.55) / 0.25));
        if (ch > 0) {
          bx(p[0], p[1] + NH / 2 + 0.07, 0.3, 0.075, null, rg("l", 0.8), ch, 1);
          tx(UC.tools[i], p[0], p[1] + NH / 2 + 0.07, "l", ch, 0.026);
        }
      }
    });
  }

  /* lower band: one panel per chapter (rules, evals, rollout, metrics) */
  function lower(c: number) {
    const B = LB, pan = (i: number) => cl(1.7 - Math.abs(c - i) * 3.4);
    let a = pan(1);
    if (a > 0)
      UC.rules.forEach((t, i) => {
        const k = sm((c - (0.85 + i * 0.08)) / 0.2) * a, y = B.y0 + (WIDE ? 0.14 : 0.1) + i * (WIDE ? 0.15 : 0.14);
        bx(B.x0 + 0.04, y, 0.05, 0.05, rg("l", k), null, k);
        tx(t, B.x0 + 0.12, y, "w", k, 0.038, "left");
      });
    a = pan(3);
    if (a > 0) {
      const pr = sm((c - 2.6) / 0.7), cols = WIDE ? 8 : 14, rows = WIDE ? 4 : 2, cs = WIDE ? 0.085 : 0.1, gp = WIDE ? 0.022 : 0.03, oy = WIDE ? 0.08 : 0.14;
      let pass = 0;
      for (let j = 0; j < cols * rows; j++) {
        const col = j % cols, row = (j / cols) | 0, rev = pr * cols * rows > j, perm = j % 13 == 7, bad = perm || j % 11 == 4;
        const ok = rev && (!bad || (pr > 0.85 && !perm)), warn = rev && bad && !ok;
        if (ok) pass++;
        bx(B.x0 + cs / 2 + 0.02 + col * (cs + gp), B.y0 + oy + cs / 2 + row * (cs + gp), cs, cs, ok ? rg("l", 0.9) : warn ? rg("a", 0.9) : null, ok || warn ? null : rg("w", 0.25), a, 1);
      }
      const pc = Math.round((pass / (cols * rows)) * 100);
      if (WIDE) {
        tx("Eval pass rate", 0.45, B.y0 + 0.08, "m", a, 0.036);
        tx(pc + "%", 0.45, B.y0 + 0.2, "l", a, 0.11, "center", 700, DISP);
        UC.guardrails.forEach((t, i) => {
          const k = sm((pr - 0.3 - i * 0.2) / 0.15) * a;
          bx(0.45, B.y0 + 0.37 + i * 0.13, 0.78, 0.095, null, rg("w", 0.35), a, 1);
          bx(0.12, B.y0 + 0.37 + i * 0.13, 0.04, 0.04, rg("l", k), null, k);
          tx(t, 0.19, B.y0 + 0.37 + i * 0.13, "w", a, 0.032, "left");
        });
      } else tx("Eval pass rate " + pc + "%", B.x0, B.y0 + 0.04, "l", a, 0.05, "left", 600, DISP);
    }
    a = pan(4);
    if (a > 0) {
      const pr = sm((c - 3.6) / 0.8) * 5.001, y = B.y0 + (WIDE ? 0.16 : 0.12), x0 = B.x0 + 0.12, x1 = B.x1 - 0.12, st = Math.min(5, Math.floor(pr));
      ctx.strokeStyle = rg("w", 0.25 * a); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx + x0 * S, cy + y * S); ctx.lineTo(cx + x1 * S, cy + y * S); ctx.stroke();
      ctx.strokeStyle = rg("l", a);
      ctx.beginPath(); ctx.moveTo(cx + x0 * S, cy + y * S); ctx.lineTo(cx + lp(x0, x1, pr / 5) * S, cy + y * S); ctx.stroke();
      UC.stages.forEach((t, i) => {
        const x = lp(x0, x1, i / 5), on = pr >= i;
        bx(x, y, 0.06, 0.06, on ? rg("l", a) : rg("k", a), rg("l", 0.8 * a), a, 1.5);
        tx(t, x, y + (WIDE || i % 2 == 0 ? 0.12 : -0.12), on ? "w" : "m", a, 0.03); /* narrow: alternate below/above so labels don't collide */
      });
      tx(st >= 3 ? UC.rollout[st - 3] : "Pipeline checks running", 0, y + (WIDE ? 0.26 : 0.22), "l", a, 0.04, "center", 600, DISP);
      if (WIDE) {
        const sh = [0, 0, 0, 0, 0.1, 1][st];
        bx(0, y + 0.4, 1.5, 0.07, null, rg("w", 0.35), a, 1);
        if (sh > 0) bx(-0.75 + sh * 0.75, y + 0.4, 1.5 * sh, 0.07, rg("l", 0.9), null, a);
        tx("Agent share of live traffic", 0, y + 0.5, "m", a, 0.03);
      }
    }
    a = pan(5);
    if (a > 0) {
      const pr = sm((c - 4.55) / 0.4);
      UC.metrics.forEach((m, i) => {
        const x = (i - 1) * (WIDE ? 0.6 : 0.72), y = B.y0 + (WIDE ? 0.16 : 0.12);
        tx(Math.round(m[1] * pr) + m[2], x, y, "l", a, WIDE ? 0.1 : 0.075, "center", 700, DISP);
        tx(m[0], x, y + (WIDE ? 0.13 : 0.1), "w", a, 0.032);
      });
      tx("Feedback loop: every correction becomes a new test case", 0, B.y0 + (WIDE ? 0.42 : 0.34), "w", a * 0.9, 0.034);
    }
  }

  /* live chapter: work items flowing through the graph, every 4th via the human */
  function packets(c: number, tm: number) {
    const pp = sm((c - 4.5) / 0.3);
    if (pp <= 0) return;
    const P = [[0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 6, 5]].map((pa) => {
      const ls: number[] = [];
      let L = 0;
      for (let i = 1; i < pa.length; i++) {
        const d = Math.hypot(NP[pa[i]][0] - NP[pa[i - 1]][0], NP[pa[i]][1] - NP[pa[i - 1]][1]);
        ls.push(d); L += d;
      }
      return { pa, ls, L };
    });
    for (let k = 0; k < 10; k++) {
      const hum = k % 4 == 3, { pa, ls, L } = P[hum ? 1 : 0];
      let s = (((tm * 0.14) + k / 10) % 1) * L, i = 0;
      while (i < ls.length - 1 && s > ls[i]) { s -= ls[i]; i++; }
      const t = s / ls[i], A = NP[pa[i]], B = NP[pa[i + 1]], x = cx + lp(A[0], B[0], t) * S, y = cy + lp(A[1], B[1], t) * S, col: Tone = hum ? "w" : "l";
      ctx.fillStyle = rg(col, pp * 0.25); ctx.beginPath(); ctx.arc(x, y, S * 0.032, 0, 6.283); ctx.fill();
      ctx.fillStyle = rg(col, pp); ctx.beginPath(); ctx.arc(x, y, S * 0.013, 0, 6.283); ctx.fill();
    }
  }

  function draw(c: number, tm: number) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = rg("w", 0.08);
    const g = S * 0.14;
    for (let x = (cx % g) - g; x < W; x += g) for (let y = (cy % g) - g + ((c * 10) % g); y < H; y += g) ctx.fillRect(x, y, 1.5, 1.5);
    brief(c, tm); pipe(c); lower(c); packets(c, tm);
  }

  resize();
  return { resize, draw };
}
