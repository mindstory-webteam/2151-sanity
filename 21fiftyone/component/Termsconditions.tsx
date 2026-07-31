"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext"; // adjust path as needed
import RollButton from "./Rollbutton";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

export default function TermsConditionsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const sections = [
    {
      num: "01",
      title: "USE OF THE WEBSITE",
      body: "This website is intended to provide information about our services, portfolio, and company. By accessing or using our website, you agree to the following:",
      list: [
        "Use the website only for lawful purposes",
        "Not misuse, copy, or attempt to disrupt the website",
        "Not engage in any activity that may harm the website or its users",
      ],
    },
    {
      num: "02",
      title: "INTELLECTUAL PROPERTY",
      body: "All content on this website is the property of 21FiftyOne unless otherwise stated. You may not reproduce, distribute, or use any content without prior written permission. This includes:",
      subsections: [
        {
          heading: "Protected Content",
          items: ["Text & Copy", "Images & Photography", "Videos & Film"],
        },
        {
          heading: "Brand Assets",
          items: ["Graphics & Illustrations", "Branding & Logos", "Creative Direction"],
        },
      ],
    },
    {
      num: "03",
      title: "SERVICES & PROJECT ENGAGEMENT",
      body: "Any engagement or project with 21FiftyOne will be governed by separate agreements or contracts.",
      list: [
        "Website content does not constitute a binding offer",
        "Scope, timelines, and pricing will be defined per project",
        "We reserve the right to accept or decline project requests",
      ],
    },
    {
      num: "04",
      title: "USER SUBMISSIONS",
      body: "When you submit information through forms (contact, inquiry, etc.):",
      list: [
        "You agree that the information provided is accurate",
        "You grant us the right to use the information to respond to your request",
        "You must not submit unlawful or harmful content",
      ],
    },
    {
      num: "05",
      title: "THIRD-PARTY LINKS",
      body: "Our website may contain links to third-party websites. We do not control or endorse these websites and are not responsible for their content, policies, or practices.",
    },
    {
      num: "06",
      title: "LIMITATION OF LIABILITY",
      body: "While we strive for accuracy, 21FiftyOne does not guarantee that the website will be error-free or uninterrupted, or that all content is complete, accurate, or up to date. We are not liable for:",
      list: [
        "Any direct or indirect damages",
        "Loss of data, business, or profits arising from website use",
      ],
    },
    {
      num: "07",
      title: "PRIVACY",
      body: "Your use of the website is also governed by our Privacy Policy, which is incorporated into these Terms by reference.",
    },
    {
      num: "08",
      title: "MODIFICATIONS",
      body: "We reserve the right to update or modify these Terms at any time and change website content without prior notice. Continued use of the website means you accept the updated Terms.",
    },
    {
      num: "09",
      title: "GOVERNING LAW",
      body: "These Terms & Conditions are governed by the laws of India. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of courts in India.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
        }

        /* ─── Base ─────────────────────────────────────────────────── */
        .tc {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 140px;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }
        .tc::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--line);
        }
        .tc-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
          box-sizing: border-box;
        }

        /* ─── Label row ─────────────────────────────────────────────── */
        .tc-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tc-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
        }
        .tc-label-right {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ─── Hero ──────────────────────────────────────────────────── */
        .tc-hero {
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 0;
          align-items: end;
          margin-bottom: 96px;
        }
        .tc-headline {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(56px, 10vw, 148px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          display: block;
          overflow: visible;
        }
        .tc-headline-accent {
          font-family: 'Playfair Display', serif !important;
          font-style: italic !important;
          font-size: clamp(36px, 7vw, 100px) !important;
          color: var(--red) !important;
          line-height: 1 !important;
          letter-spacing: -0.01em !important;
          display: block;
          margin-top: 8px;
          overflow: visible;
        }
        .tc-headline [data-roll-unit],
        .tc-headline-accent [data-roll-unit] {
          overflow: hidden;
        }

        /* ─── Dark intro card ───────────────────────────────────────── */
        .tc-intro-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          align-self: end;
          margin-left: 64px;
          box-sizing: border-box;
        }
        .tc-intro-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 48px;
          background: var(--red);
        }
        .tc-intro-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #b0a99e;
          margin-bottom: 28px;
          font-weight: 300;
        }
        .tc-intro-card .tc-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .tc-date-badge .badge-num {
          font-family: 'Anton', sans-serif;
          font-size: 36px;
          line-height: 1;
          color: #fff;
        }
        .tc-date-badge .badge-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          line-height: 1.5;
        }

        /* ─── Content layout ────────────────────────────────────────── */
        .tc-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        /* ─── Sticky sidebar ────────────────────────────────────────── */
        .tc-sidebar {
          position: sticky;
          top: 40px;
        }
        .tc-toc-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 28px;
        }
        .tc-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-left: 1px solid var(--line);
        }
        .tc-toc-item { padding: 0; }
        .tc-toc-link {
          display: flex;
          align-items: baseline;
          gap: 12px;
          padding: 10px 0 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
        }
        .tc-toc-link::before {
          content: '';
          position: absolute;
          left: -1px; top: 0; bottom: 0;
          width: 2px;
          background: var(--red);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .tc-toc-link:hover { color: var(--black); }
        .tc-toc-link:hover::before { transform: scaleY(1); }
        .tc-toc-num {
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          color: var(--red);
          opacity: 0.6;
          flex-shrink: 0;
        }

        /* ─── Sections ──────────────────────────────────────────────── */
        .tc-sections { display: flex; flex-direction: column; }
        .tc-section {
          padding: 48px 0;
          border-top: 1px solid var(--line);
        }
        .tc-section:last-child { border-bottom: 1px solid var(--line); }
        .tc-section-header {
          display: flex;
          align-items: baseline;
          gap: 20px;
          margin-bottom: 28px;
        }
        .tc-section-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: var(--red);
          flex-shrink: 0;
        }
        .tc-section-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--black);
        }
        .tc-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.82;
          color: #3a3735;
          font-weight: 300;
          margin-bottom: 16px;
          text-align: justify;
        }
        .tc-subsection-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 24px 0 14px;
        }
        .tc-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tc-list li {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #3a3735;
          font-weight: 300;
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .tc-list li::before {
          content: '—';
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: var(--red);
          flex-shrink: 0;
        }
        .tc-subsections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 8px;
        }
        .tc-subsection-card {
          background: #eae4db;
          padding: 28px 28px 24px;
          position: relative;
        }
        .tc-subsection-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 32px;
          background: var(--red);
        }

        /* ─── Quote block ───────────────────────────────────────────── */
        .tc-quote-block {
          margin: 48px 0 0;
          padding: 36px 40px;
          background: var(--black);
          position: relative;
        }
        .tc-quote-block::before {
          content: '\u201C';
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          color: var(--red);
          opacity: 0.18;
          position: absolute;
          top: -16px; left: 24px;
          line-height: 1;
        }
        .tc-quote-block blockquote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 20px;
          line-height: 1.55;
          color: #b0a99e;
          position: relative;
          z-index: 1;
          margin: 0;
        }
        .tc-quote-block cite {
          font-family: 'DM Sans', sans-serif;
          font-style: normal;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #666;
          margin-top: 20px;
          display: block;
        }

        /* ─── Contact card ──────────────────────────────────────────── */
        .tc-contact-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          margin-top: 80px;
        }
        .tc-contact-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 48px;
          background: var(--red);
        }
        .tc-contact-card .tc-section-num { display: block; margin-bottom: 12px; }
        .tc-contact-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 28px;
        }
        .tc-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .tc-contact-item .ci-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }
        .tc-contact-item .ci-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #b0a99e;
          font-weight: 300;
        }
        .tc-contact-item .ci-value a {
          color: var(--red);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .tc-contact-item .ci-value a:hover { opacity: 0.75; }

        /* ─── Scroll reveal ─────────────────────────────────────────── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.08s; }
        [data-reveal][data-d="2"] { transition-delay: 0.18s; }
        [data-reveal][data-d="3"] { transition-delay: 0.3s; }
        [data-reveal][data-d="4"] { transition-delay: 0.44s; }
        [data-reveal][data-d="5"] { transition-delay: 0.58s; }

        /* ─── Responsive ────────────────────────────────────────────── */
        @media (max-width: 1280px) {
          .tc-inner { padding: 0 48px; }
          .tc::before { left: 48px; right: 48px; }
          .tc-hero { grid-template-columns: 1fr 420px; }
          .tc-intro-card { margin-left: 40px; padding: 40px 36px 36px; }
          .tc-content { gap: 56px; }
        }
        @media (max-width: 1024px) {
          .tc { padding: 80px 0 100px; }
          .tc-inner { padding: 0 40px; }
          .tc::before { left: 40px; right: 40px; }
          .tc-label-row { margin-bottom: 40px; }
          .tc-hero { grid-template-columns: 1fr; margin-bottom: 64px; }
          .tc-intro-card { margin-left: 0; margin-top: 40px; }
          .tc-content { grid-template-columns: 1fr; gap: 0; }
          .tc-sidebar { position: static; margin-bottom: 48px; }
          .tc-subsections-grid { grid-template-columns: 1fr; gap: 20px; }
          .tc-contact-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 768px) {
          .tc { padding: 64px 0 80px; }
          .tc-inner { padding: 0 28px; }
          .tc::before { left: 28px; right: 28px; }
          .tc-intro-card { padding: 32px 28px 28px; margin-top: 32px; }
          .tc-intro-card p { font-size: 14px; }
          .tc-quote-block { padding: 28px; }
          .tc-quote-block blockquote { font-size: 17px; }
          .tc-contact-card { padding: 36px 28px 32px; }
        }
        @media (max-width: 600px) {
          .tc { padding: 56px 0 72px; }
          .tc-inner { padding: 0 20px; }
          .tc::before { left: 20px; right: 20px; }
          .tc-section { padding: 36px 0; }
          .tc-section-title { font-size: 18px; }
          .tc-body { font-size: 14px; }
          .tc-list li { font-size: 13px; }
          .tc-subsection-card { padding: 24px 20px 20px; }
          .tc-quote-block { padding: 24px 20px; margin-top: 36px; }
          .tc-quote-block::before { font-size: 80px; top: -10px; left: 14px; }
          .tc-quote-block blockquote { font-size: 16px; }
          .tc-contact-card { margin-top: 56px; padding: 28px 20px 24px; }
          .tc-contact-title { font-size: 22px; }
          .tc-contact-item .ci-value { font-size: 13px; }
        }
        @media (max-width: 480px) {
          .tc-inner { padding: 0 16px; }
          .tc::before { left: 16px; right: 16px; }
          .tc-label-row { margin-bottom: 24px; }
          .tc-hero { margin-bottom: 36px; }
          .tc-intro-card { padding: 24px 18px 20px; margin-top: 24px; }
          .tc-intro-card p { font-size: 13px; }
          .tc-section-title { font-size: 17px; }
          .tc-toc-link { font-size: 10px; padding-left: 16px; }
        }
      `}</style>

      <section className="tc" ref={sectionRef}>
        <div className="tc-inner">

          {/* Label row */}
          <div className="tc-label-row" data-reveal>
            <span className="tc-label">21FIFTYONE</span>
            <span className="tc-label-right">LEGAL — TERMS</span>
          </div>

          {/* Hero */}
          <div className="tc-hero">
            <div>
              <SplitText
                text="TERMS &"
                tag="div"
                className="tc-headline"
                delay={45}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                onLetterAnimationComplete={handleAnimationComplete}
                showCallback
                hoverRoll
                autoRoll
                autoRollInterval={5500}
                autoRollDuration={620}
                hoverRollDirection="center"
              />

              <SplitText
                text="Conditions"
                tag="div"
                className="tc-headline-accent"
                delay={35}
                duration={1.4}
                ease="power4.out"
                splitType="words"
                from={{ opacity: 0, y: 80, skewX: 8 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
                hoverRoll
                autoRoll
                autoRollInterval={5500}
                autoRollDuration={620}
                hoverRollDirection="left"
              />
            </div>

            {/* Dark intro card */}
            <div className="tc-intro-card" data-reveal data-d="2">
              <p>
                Welcome to 21FiftyOne. By accessing or using our website, you agree to
                comply with and be bound by the following Terms &amp; Conditions.
                If you do not agree, please do not use this website.
              </p>
              <div className="tc-date-badge">
                <span className="badge-num">2026</span>
                <span className="badge-label">Effective Date<br />02 April</span>
              </div>
            </div>
          </div>

          {/* Content: sidebar + sections */}
          <div className="tc-content">

            {/* Sticky sidebar ToC */}
            <div className="tc-sidebar" data-reveal data-d="2">
              <p className="tc-toc-title">Contents</p>
              <ul className="tc-toc-list">
                {sections.map((s) => (
                  <li key={s.num} className="tc-toc-item">
                    <a href={`#tc-${s.num}`} className="tc-toc-link">
                      <span className="tc-toc-num">{s.num}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
                <li className="tc-toc-item">
                  <a href="#tc-10" className="tc-toc-link">
                    <span className="tc-toc-num">10</span>
                    CONTACT US
                  </a>
                </li>
              </ul>
            </div>

            {/* Sections */}
            <div className="tc-sections">
              {sections.map((s, i) => (
                <div
                  key={s.num}
                  id={`tc-${s.num}`}
                  className="tc-section"
                  data-reveal
                  data-d={String(Math.min(i + 2, 5))}
                >
                  <div className="tc-section-header">
                    <span className="tc-section-num">{s.num}</span>
                    <h2 className="tc-section-title">{s.title}</h2>
                  </div>

                  {s.body && <p className="tc-body">{s.body}</p>}

                  {s.list && (
                    <ul className="tc-list">
                      {s.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {s.subsections && (
                    <div className="tc-subsections-grid">
                      {s.subsections.map((sub) => (
                        <div key={sub.heading} className="tc-subsection-card">
                          <p className="tc-subsection-title">{sub.heading}</p>
                          <ul className="tc-list">
                            {sub.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Quote block */}
              <div className="tc-quote-block" data-reveal data-d="4">
                <blockquote>
                  &ldquo;Every frame we create is a commitment — to craft, to clarity,
                  and to the trust you place in us.&rdquo;
                </blockquote>
                <cite>21FIFTYONE — Our Standard</cite>
              </div>

              {/* Contact card */}
              <div className="tc-contact-card" id="tc-10" data-reveal data-d="4">
                <span className="tc-section-num">10</span>
                <h2 className="tc-contact-title">CONTACT US</h2>
                <div className="tc-contact-grid">
                  <div className="tc-contact-item">
                    <span className="ci-label">Email</span>
                    <p className="ci-value">
                      <a href="mailto:hello@21fiftyone.com">hello@21fiftyone.com</a>
                    </p>
                  </div>
                  <div className="tc-contact-item">
                    <span className="ci-label">Location</span>
                    <p className="ci-value">
                      Mind Premium Private Limited<br />
                      7th Floor, Tower 2, Regus<br />
                      Door No. 2703, Cabin 721<br />
                      HiLITE Business Park, Pantheeramkavu<br />
                      Kozhikode — 673 014
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: "32px" }}>
                  <RollButton label="Get In Touch" href="mailto:hello@21fiftyone.com" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}