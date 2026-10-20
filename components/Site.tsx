import Film from "@/components/Film";
import ServiceGrid from "@/components/ServiceGrid";
import SiteProvider from "@/components/SiteProvider";
import { LogoMark, LogoSymbol } from "@/components/Logo";
import { OpenProjectButton, ScrollProgress, ScrollToSection } from "@/components/controls";
import { CONTACT_EMAIL } from "@/lib/content";

export default function Site({ section }: { section?: string }) {
  return (
    <SiteProvider>
      <LogoSymbol />
      <nav>
        <div className="wrap">
          <a className="logo" href="#top" aria-label="Coders Alley home"><LogoMark />Coders Alley<em>_</em></a>
          {/* <div className="l"><a href="#services">Services</a><a href="#contact">Contact</a></div> */}
          <OpenProjectButton className="btn sm">Talk to us</OpenProjectButton>
        </div>
      </nav>
      <ScrollProgress />
      {section && <ScrollToSection id={section} />}

      <main id="top">
        <Film />

        <section className="s" id="services">
          <div className="wrap">
            <div className="tag">What we automate</div>
            <h2>Agents and automations that take work off your team.</h2>
            <ServiceGrid />
            <p style={{ marginTop: 28 }}>Alongside automation we deliver web development, AI engineering, and cloud and security.</p>
          </div>
        </section>

        <section className="s cta" id="contact">
          <div className="wrap">
            <h2>Ready to build your next system?</h2>
            <p>Share your goals and we&apos;ll propose a clear plan.</p>
            <OpenProjectButton>Request a free trial call</OpenProjectButton>
            <small>Typical response within 24 hours.</small>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="ft">
            <div>
              <a className="logo" href="#top"><LogoMark />Coders Alley</a>
              <p style={{ marginTop: 10, maxWidth: "42ch" }}>Mission-ready engineering across web, AI, and secure cloud systems. Built to ship and built to last.</p>
            </div>
            <div>
              <div className="ct">
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                <a href="tel:+923226188545">+92 (322) 618-8545</a>
                <a href="https://www.linkedin.com/company/codersalley">LinkedIn</a>
              </div>
              <div className="cp">&copy; 2026 Coders Alley. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </SiteProvider>
  );
}
