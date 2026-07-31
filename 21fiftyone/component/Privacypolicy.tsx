"use client";

import { useEffect, useRef } from "react";
import SplitText from "./Splittext"; // adjust path as needed
import RollButton from "./Rollbutton";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

export default function PrivacyPolicySection() {
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
      title: "INFORMATION WE COLLECT",
      subsections: [
        {
          heading: "Personal Information",
          items: ["Name", "Email address", "Phone number", "Company / Brand name", "Details submitted via contact forms"],
        },
        {
          heading: "Non-Personal Information",
          items: ["Browser type and device", "IP address", "Pages visited and time spent", "Cookies and usage data"],
        },
      ],
    },
    {
      num: "02",
      title: "HOW WE USE YOUR INFORMATION",
      list: [
        "Respond to inquiries and project requests",
        "Provide services and communicate updates",
        "Improve website performance and user experience",
        "Send relevant updates or marketing (only if opted-in)",
      ],
    },
    {
      num: "03",
      title: "COOKIES & TRACKING",
      body: "Our website may use cookies and similar technologies to enhance user experience, analyse website traffic, and understand user behaviour. You can choose to disable cookies through your browser settings.",
    },
    {
      num: "04",
      title: "DATA SHARING",
      body: "We do not sell, trade, or rent your personal information. We may share data with trusted service providers (hosting, analytics, etc.) or legal authorities if required by law.",
    },
    {
      num: "05",
      title: "DATA SECURITY",
      body: "We implement appropriate security measures to protect your personal data from unauthorised access, misuse, or disclosure. However, no method of transmission over the internet is 100% secure.",
    },
    {
      num: "06",
      title: "THIRD-PARTY LINKS",
      body: "Our website may contain links to external websites. We are not responsible for the privacy practices or content of those sites.",
    },
    {
      num: "07",
      title: "YOUR RIGHTS",
      list: [
        "Access your personal data",
        "Request corrections or updates",
        "Request deletion of your data",
      ],
      body: "To exercise these rights, contact us using the details below.",
    },
    {
      num: "08",
      title: "UPDATES TO THIS POLICY",
      body: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.",
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
        .pp {
          width: 100%;
          background: var(--cream);
          padding: 120px 0 140px;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }
        .pp::before {
          content: '';
          position: absolute;
          top: 0; left: 64px; right: 64px;
          height: 1px;
          background: var(--line);
        }
        .pp-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
          box-sizing: border-box;
        }

        /* ─── Label row ─────────────────────────────────────────────── */
        .pp-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 56px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pp-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--red);
        }
        .pp-label-right {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* ─── Hero ──────────────────────────────────────────────────── */
        .pp-hero {
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 0;
          align-items: end;
          margin-bottom: 96px;
        }
        .pp-headline {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(56px, 10vw, 148px) !important;
          line-height: 0.88 !important;
          letter-spacing: -0.02em !important;
          color: var(--black) !important;
          text-transform: uppercase;
          display: block;
          overflow: visible;
        }
        .pp-headline-accent {
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
        .pp-headline [data-roll-unit],
        .pp-headline-accent [data-roll-unit] {
          overflow: hidden;
        }

        /* ─── Dark intro card ───────────────────────────────────────── */
        .pp-intro-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          align-self: end;
          margin-left: 64px;
          box-sizing: border-box;
        }
        .pp-intro-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 48px;
          background: var(--red);
        }
        .pp-intro-card p {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #b0a99e;
          margin-bottom: 28px;
          font-weight: 300;
        }
        .pp-intro-card .pp-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .pp-date-badge .badge-num {
          font-family: 'Anton', sans-serif;
          font-size: 36px;
          line-height: 1;
          color: #fff;
        }
        .pp-date-badge .badge-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          line-height: 1.5;
        }

        /* ─── Content layout ────────────────────────────────────────── */
        .pp-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 80px;
          align-items: start;
        }

        /* ─── Sticky sidebar ────────────────────────────────────────── */
        .pp-sidebar {
          position: sticky;
          top: 40px;
        }
        .pp-toc-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 28px;
        }
        .pp-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          border-left: 1px solid var(--line);
        }
        .pp-toc-item {
          padding: 0;
        }
        .pp-toc-link {
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
        .pp-toc-link::before {
          content: '';
          position: absolute;
          left: -1px; top: 0; bottom: 0;
          width: 2px;
          background: var(--red);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .pp-toc-link:hover { color: var(--black); }
        .pp-toc-link:hover::before { transform: scaleY(1); }
        .pp-toc-num {
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          color: var(--red);
          opacity: 0.6;
          flex-shrink: 0;
        }

        /* ─── Sections ──────────────────────────────────────────────── */
        .pp-sections { display: flex; flex-direction: column; }
        .pp-section {
          padding: 48px 0;
          border-top: 1px solid var(--line);
        }
        .pp-section:last-child { border-bottom: 1px solid var(--line); }
        .pp-section-header {
          display: flex;
          align-items: baseline;
          gap: 20px;
          margin-bottom: 28px;
        }
        .pp-section-num {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          color: var(--red);
          flex-shrink: 0;
        }
        .pp-section-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--black);
        }
        .pp-body {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.82;
          color: #3a3735;
          font-weight: 300;
          margin-bottom: 16px;
          text-align: justify;
        }
        .pp-subsection-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          margin: 24px 0 14px;
        }
        .pp-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pp-list li {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #3a3735;
          font-weight: 300;
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .pp-list li::before {
          content: '—';
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: var(--red);
          flex-shrink: 0;
        }
        .pp-subsections-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-top: 8px;
        }
        .pp-subsection-card {
          background: #eae4db;
          padding: 28px 28px 24px;
          position: relative;
        }
        .pp-subsection-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 32px;
          background: var(--red);
        }

        /* ─── Quote block ───────────────────────────────────────────── */
        .pp-quote-block {
          margin: 48px 0 0;
          padding: 36px 40px;
          background: var(--black);
          position: relative;
        }
        .pp-quote-block::before {
          content: '\u201C';
          font-family: 'Playfair Display', serif;
          font-size: 120px;
          color: var(--red);
          opacity: 0.18;
          position: absolute;
          top: -16px; left: 24px;
          line-height: 1;
        }
        .pp-quote-block blockquote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 20px;
          line-height: 1.55;
          color: #b0a99e;
          position: relative;
          z-index: 1;
          margin: 0;
        }
        .pp-quote-block cite {
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
        .pp-contact-card {
          background: var(--black);
          padding: 48px 44px 44px;
          position: relative;
          margin-top: 80px;
        }
        .pp-contact-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 48px;
          background: var(--red);
        }
        .pp-contact-card .pp-section-num { display: block; margin-bottom: 12px; }
        .pp-contact-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 28px;
        }
        .pp-contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .pp-contact-item .ci-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 8px;
          display: block;
        }
        .pp-contact-item .ci-value {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          line-height: 1.7;
          color: #b0a99e;
          font-weight: 300;
        }
        .pp-contact-item .ci-value a {
          color: var(--red);
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .pp-contact-item .ci-value a:hover { opacity: 0.75; }

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
          .pp-inner { padding: 0 48px; }
          .pp::before { left: 48px; right: 48px; }
          .pp-hero { grid-template-columns: 1fr 420px; }
          .pp-intro-card { margin-left: 40px; padding: 40px 36px 36px; }
          .pp-content { gap: 56px; }
        }
        @media (max-width: 1024px) {
          .pp { padding: 80px 0 100px; }
          .pp-inner { padding: 0 40px; }
          .pp::before { left: 40px; right: 40px; }
          .pp-label-row { margin-bottom: 40px; }
          .pp-hero { grid-template-columns: 1fr; margin-bottom: 64px; }
          .pp-intro-card { margin-left: 0; margin-top: 40px; }
          .pp-content { grid-template-columns: 1fr; gap: 0; }
          .pp-sidebar { position: static; margin-bottom: 48px; }
          .pp-subsections-grid { grid-template-columns: 1fr; gap: 20px; }
          .pp-contact-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        @media (max-width: 768px) {
          .pp { padding: 64px 0 80px; }
          .pp-inner { padding: 0 28px; }
          .pp::before { left: 28px; right: 28px; }
          .pp-intro-card { padding: 32px 28px 28px; margin-top: 32px; }
          .pp-intro-card p { font-size: 14px; }
          .pp-quote-block { padding: 28px; }
          .pp-quote-block blockquote { font-size: 17px; }
          .pp-contact-card { padding: 36px 28px 32px; }
        }
        @media (max-width: 600px) {
          .pp { padding: 56px 0 72px; }
          .pp-inner { padding: 0 20px; }
          .pp::before { left: 20px; right: 20px; }
          .pp-section { padding: 36px 0; }
          .pp-section-title { font-size: 18px; }
          .pp-body { font-size: 14px; }
          .pp-list li { font-size: 13px; }
          .pp-subsection-card { padding: 24px 20px 20px; }
          .pp-quote-block { padding: 24px 20px; margin-top: 36px; }
          .pp-quote-block::before { font-size: 80px; top: -10px; left: 14px; }
          .pp-quote-block blockquote { font-size: 16px; }
          .pp-contact-card { margin-top: 56px; padding: 28px 20px 24px; }
          .pp-contact-title { font-size: 22px; }
          .pp-contact-item .ci-value { font-size: 13px; }
        }
        @media (max-width: 480px) {
          .pp-inner { padding: 0 16px; }
          .pp::before { left: 16px; right: 16px; }
          .pp-label-row { margin-bottom: 24px; }
          .pp-hero { margin-bottom: 36px; }
          .pp-intro-card { padding: 24px 18px 20px; margin-top: 24px; }
          .pp-intro-card p { font-size: 13px; }
          .pp-section-title { font-size: 17px; }
          .pp-toc-link { font-size: 10px; padding-left: 16px; }
        }
      `}</style>

      <section className="pp" ref={sectionRef}>
        <div className="pp-inner">

          {/* Label row */}
          <div className="pp-label-row" data-reveal>
            <span className="pp-label">21FIFTYONE</span>
            <span className="pp-label-right">LEGAL — PRIVACY</span>
          </div>

          {/* Hero */}
          <div className="pp-hero">
            <div>
              <SplitText
                text="PRIVACY"
                tag="div"
                className="pp-headline"
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
                text="POLICY"
                tag="div"
                className="pp-headline-accent"
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

            <div className="pp-intro-card" data-reveal data-d="2">
              <p>
                At 21FiftyOne, we value your privacy and are committed to protecting your
                personal information. This policy outlines how we collect, use, and safeguard
                your data when you visit our website.
              </p>
              <div className="pp-date-badge">
                <span className="badge-num">2026</span>
                <span className="badge-label">Effective Date<br />02 April</span>
              </div>
            </div>
          </div>

          {/* Content: sidebar + sections */}
          <div className="pp-content">

            {/* Sidebar ToC */}
            <div className="pp-sidebar" data-reveal data-d="2">
              <p className="pp-toc-title">Contents</p>
              <ul className="pp-toc-list">
                {sections.map((s) => (
                  <li key={s.num} className="pp-toc-item">
                    <a href={`#pp-${s.num}`} className="pp-toc-link">
                      <span className="pp-toc-num">{s.num}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
                <li className="pp-toc-item">
                  <a href="#pp-09" className="pp-toc-link">
                    <span className="pp-toc-num">09</span>
                    CONTACT US
                  </a>
                </li>
              </ul>
            </div>

            {/* Sections */}
            <div className="pp-sections">
              {sections.map((s, i) => (
                <div
                  key={s.num}
                  id={`pp-${s.num}`}
                  className="pp-section"
                  data-reveal
                  data-d={String(Math.min(i + 2, 5))}
                >
                  <div className="pp-section-header">
                    <span className="pp-section-num">{s.num}</span>
                    <h2 className="pp-section-title">{s.title}</h2>
                  </div>

                  {s.body && <p className="pp-body">{s.body}</p>}

                  {s.list && (
                    <ul className="pp-list">
                      {s.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {s.subsections && (
                    <div className="pp-subsections-grid">
                      {s.subsections.map((sub) => (
                        <div key={sub.heading} className="pp-subsection-card">
                          <p className="pp-subsection-title">{sub.heading}</p>
                          <ul className="pp-list">
                            {sub.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Extra body after list for section 07 */}
                  {s.num === "07" && s.body && s.list && (
                    <p className="pp-body" style={{ marginTop: "16px" }}>{s.body}</p>
                  )}
                </div>
              ))}

              {/* Quote block */}
              <div className="pp-quote-block" data-reveal data-d="4">
                <blockquote>
                  &ldquo;Your trust is the foundation of everything we create.
                  We handle your data with the same care we bring to every frame we shoot.&rdquo;
                </blockquote>
                <cite>21FIFTYONE — Our Commitment</cite>
              </div>

              {/* Contact card */}
              <div className="pp-contact-card" id="pp-09" data-reveal data-d="4">
                <span className="pp-section-num">09</span>
                <h2 className="pp-contact-title">CONTACT US</h2>
                <div className="pp-contact-grid">
                  <div className="pp-contact-item">
                    <span className="ci-label">Email</span>
                    <p className="ci-value">
                      <a href="mailto:hello@21fiftyone.com">hello@21fiftyone.com</a>
                    </p>
                  </div>
                  <div className="pp-contact-item">
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