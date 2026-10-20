import type { Metadata } from "next";
import Site from "@/components/Site";

export const metadata: Metadata = {
  title: "Services | Coders Alley",
  description: "AI agents and automations that take work off your team, alongside web development, AI engineering, and cloud and security.",
  alternates: { canonical: "/services" },
};

/* Same page as the home route, opened at the "What we automate" section. */
export default function Services() {
  return <Site section="services" />;
}
