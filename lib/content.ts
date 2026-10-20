export type Chapter = {
  tab: string;
  title: string;
  body: string;
  tags: string[];
  more?: string;
};

export const CHAPTERS: Chapter[] = [
  {
    tab: "Brief",
    title: "Cool products. Clean code. Real business impact.",
    body: "From the first requirements call to production, we ship AI agents and automations your team can trust, alongside web, and cloud engineering.",
    tags: ["AI agents", "Workflow automation", "Web", "Cloud"],
  },
  {
    tab: "Design",
    title: "Map the workflow before we write code.",
    body: "Requirements become an agent workflow: triggers, steps, tools, and a human fallback for anything risky.",
    tags: ["Triggers", "Agent steps", "Human fallback"],
    more: "We agree the decision rules up front, such as when the agent replies on its own and when it hands off to a person.",
  },
  {
    tab: "Build",
    title: "Wire the agent into your real tools.",
    body: "LLMs, retrieval, and your existing systems connected through clean, secure integrations.",
    tags: ["LLM + RAG", "API integrations", "Secure by default"],
    more: "Each step is a tested module. Prompts, retrieval, rules, and connectors are versioned like any other code.",
  },
  {
    tab: "Test",
    title: "Prove it on real cases before launch.",
    body: "We run the agent against real historical cases and set pass marks for accuracy, safety, and escalation.",
    tags: ["Evals", "Guardrails", "Edge cases"],
    more: "Failures become new test cases, so the agent only gets better. Nothing ships until it clears the agreed bar.",
  },
  {
    tab: "Ship",
    title: "Roll out gradually, with humans in the loop.",
    body: "Shadow mode first, then a small share of live traffic, then everyone, with a rollback ready at every stage.",
    tags: ["Shadow mode", "Staged rollout", "Rollback"],
    more: "In shadow mode the agent drafts and people send, so you see real results with no risk to customers.",
  },
  {
    tab: "Live",
    title: "Run it, measure it, keep improving it.",
    body: "Dashboards, alerts, and feedback loops keep the automation accurate and cost-aware long after launch.",
    tags: ["Monitoring", "Feedback loop", "Cost control"],
    more: "Every escalation and correction feeds back into the evals, so the agent keeps getting better.",
  },
];

export const TICKER = [
  "Support agents", "Lead automation", "n8n", "Zapier", "Document processing", "RAG workflows",
  "LLM integration", "MLOps", "Workflow automation", "Web development", "Cloud architecture", "DevSecOps",
  "AWS", "GCP", "Microsoft Azure", "Python", "JavaScript", "TypeScript", "Django", "Flask", "FAST API",
  "React", "Node.js", "Express.js", "Next.js", "Nest.js", "Evals and guardrails", "Monitoring",
];

export type Service = { title: string; body: string; points: string[] };

export const SERVICES: Service[] = [
  { title: "Customer support agent", body: "Triage tickets, answer from your knowledge base, and escalate with full context.", points: ["Ticket triage", "RAG answers", "Human handoff"] },
  { title: "Lead management", body: "Capture, enrich, score, and route leads in minutes instead of days.", points: ["Enrichment", "Scoring", "CRM sync"] },
  { title: "Document processing", body: "Extract, validate, and file invoices, contracts, and forms automatically.", points: ["LLM extraction", "Validation rules", "ERP sync"] },
  { title: "Knowledge assistant", body: "Answers from your docs, tickets, and wikis, with sources and access controls.", points: ["Citations", "Access control", "Slack and Teams"] },
  { title: "Back-office workflows", body: "Approvals, onboarding, and reconciliations that run themselves.", points: ["Approval flows", "Audit trail", "Alerts"] },
  { title: "Reporting agents", body: "Scheduled reports and anomaly alerts without the spreadsheet work.", points: ["Scheduled reports", "Anomaly alerts", "Cost tracking"] },
];

/* the example workflow drawn by the hero animation */
export const WORKFLOW = {
  nodes: ["Trigger", "Understand", "Retrieve", "Act", "Guardrails", "Complete", "Human"],
  tools: ["Webhooks", "LLM", "Knowledge base", "Your APIs", "Policy checks", "Your systems"],
  rules: ["Confidence 85%+ => act on its own", "Sensitive cases => human review", "Unsure => escalate with context"],
  guardrails: ["No sensitive data leaks", "Every action logged", "Escalates when unsure"],
  metrics: [["Automated", 72, "%"], ["Turnaround", 38, "s"], ["Escalated", 9, "%"]] as [string, number, string][],
  sources: ["Email", "Chat", "Forms", "Docs", "APIs"],
  stages: ["Commit", "Build", "Evals", "Shadow", "10%", "100%"],
  rollout: ["Shadow mode: agent drafts, people send", "10% of live traffic", "100% of traffic, rollback ready"],
};

export const PROJECT_OPTIONS = {
  needs: ["AI agent or automation", "Web development", "Cloud and security"],
  budgets: ["Under $2k", "$2k to $5k", "$5k to $10k", "$10k+"],
  timelines: ["Within 1 week", "1 to 3 months", "3 to 6 months", "Not sure yet"],
};

export const CONTACT_EMAIL = "hr@codersalley.com";
