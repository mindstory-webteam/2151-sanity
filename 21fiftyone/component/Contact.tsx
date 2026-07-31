"use client";

import React, { useRef, useEffect, useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight, Send } from "lucide-react";
import SplitText from "./Splittext";
import RollButton from "./Rollbutton";

const EJS_SERVICE_ID  = "service_zwdympt";
const EJS_TEMPLATE_ID = "template_vikbi0a";
const EJS_PUBLIC_KEY  = "3YkH5VjLx7c2I0N3y";

/* ─────────────────────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────────────────────── */
const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  /* reveal on scroll */
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;
    setError("");
    setSending(true);

    try {
      // Dynamically import so it's only loaded client-side
      const emailjs = (await import("@emailjs/browser")).default;

      const result = await emailjs.send(
        EJS_SERVICE_ID,
        EJS_TEMPLATE_ID,
        {
          name:    formData.name,
          message: [
            `Email: ${formData.email}`,
            formData.company ? `Company: ${formData.company}` : "",
            formData.service ? `Service: ${formData.service}` : "",
            formData.message ? `\n${formData.message}` : "",
          ].filter(Boolean).join("\n"),
          time:    new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        EJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setSent(true);
      } else {
        throw new Error("Unexpected response from EmailJS");
      }
    } catch (err: any) {
      console.error("EmailJS error:", err);
      // Show a human-readable message instead of [object Object]
      const msg =
        typeof err?.text === "string"  ? err.text  :
        typeof err?.message === "string" ? err.message :
        "Failed to send. Please try again or email us directly.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  const services = [
    "AI Video",
    "Anchor / Presenter",
    "Concept Video",
    "Explainer Video",
    "Product Video",
    "Campaign",
    "Interview",
    "Other",
  ];

  /* ─────────────────────────────────────────────
     CONTACT INFO — each entry can hold one or more
     clickable values (used here to show two phone
     numbers under "Call Us").
  ───────────────────────────────────────────── */
  const contactInfo = [
    {
      icon: <Mail size={16} />,
      label: "Email Us",
      items: [
        { value: "hello@21fiftyone.com", href: "mailto:hello@21fiftyone.com" },
      ],
    },
    {
      icon: <Phone size={16} />,
      label: "Call Us",
      items: [
        { value: "+91 98765 43210", href: "tel:+919876543210" },
        { value: "+91 8281610051", href: "tel:+918281610051" },
      ],
    },
    {
      icon: <MapPin size={16} />,
      label: "Find Us",
      items: [
        {
          value:
            "Regus Door No. 2703, Cabin 721, HiLITE Business Park, 7th Floor, Tower 2, Pantheeramkavu, Kozhikode, Kerala 673014",
          href: "#",
        },
      ],
    },
  ];

  return (
    <section className="ct" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
        }

        .ct {
          width: 100%;
          background: var(--cream);
          position: relative;
          overflow: hidden;
          padding-bottom: 120px;
        }
        .ct::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* ── HEADER ── */
        .ct-hdr {
          max-width: 1280px; margin: 0 auto; padding: 100px 80px 56px;
          display: flex; justify-content: space-between; align-items: flex-end;
          gap: 40px; border-bottom: 1px solid var(--line); position: relative; z-index: 1;
        }
        .ct-hdr-left { flex: 1; min-width: 0; overflow: visible; }
        .ct-eyebrow {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.32em; text-transform: uppercase; color: var(--red);
          display: block; margin-bottom: 16px;
        }
        .ct-h1 {
          font-family: 'Anton', sans-serif !important;
          font-size: clamp(48px, 7vw, 104px) !important;
          line-height: 0.88 !important; letter-spacing: -0.01em !important;
          color: var(--black) !important; text-transform: uppercase;
          display: block !important; overflow: visible !important;
          padding: 10px 6px 6px !important; margin-left: -6px !important;
        }
        .ct-h1 > div { overflow: visible !important; }
        .ct-h1-accent {
          font-family: 'Playfair Display', serif !important; font-style: italic !important;
          font-size: clamp(40px, 5.8vw, 88px) !important; color: var(--red) !important;
          line-height: 0.95 !important; letter-spacing: -0.01em !important;
          display: block !important; overflow: visible !important;
          padding: 0 6px 6px !important; margin-left: -6px !important; margin-top: -0.04em;
        }
        .ct-h1-accent > div { overflow: visible !important; }
        .ct-hdr-desc {
          font-family: 'DM Sans', sans-serif; font-size: 15px; line-height: 1.82;
          color: #5a5450; font-weight: 300; max-width: 460px; margin-top: 24px;
        }
        .ct-hdr-right {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: 20px; padding-bottom: 8px; flex-shrink: 0;
        }

        /* ── BODY ── */
        .ct-body {
          max-width: 1280px; margin: 0 auto; padding: 64px 80px 0;
          display: grid; grid-template-columns: 1fr 1.6fr; gap: 48px;
          position: relative; z-index: 1;
        }

        /* ── LEFT PANEL ── */
        .ct-left { display: flex; flex-direction: column; gap: 32px; }
        .ct-info-cards { display: flex; flex-direction: column; gap: 3px; }
        .ct-info-card {
          display: flex; align-items: flex-start; gap: 18px; padding: 20px 24px;
          background: #ece7df; border-left: 3px solid var(--red);
          text-decoration: none; transition: background 0.2s, box-shadow 0.2s;
        }
        .ct-info-card:hover { background: var(--black); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        .ct-info-card:hover .ct-info-icon { color: var(--red); }
        .ct-info-card:hover .ct-info-label { color: rgba(255,255,255,0.4); }
        .ct-info-card:hover .ct-info-val { color: #fff; }
        .ct-info-card:hover .ct-info-arrow { opacity: 1; color: var(--red); }
        .ct-info-icon { color: var(--muted); flex-shrink: 0; transition: color 0.2s; margin-top: 2px; }
        .ct-info-text { flex: 1; }
        .ct-info-label {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.28em;
          text-transform: uppercase; color: var(--muted); display: block;
          margin-bottom: 4px; transition: color 0.2s;
        }
        .ct-info-val {
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          font-weight: 500; color: var(--black); transition: color 0.2s;
        }
        .ct-info-val-link {
          display: block; text-decoration: none; cursor: pointer;
        }
        .ct-info-val-link:hover { color: var(--red); }
        .ct-info-card:hover .ct-info-val-link:hover { color: var(--red); }
        .ct-info-val-link + .ct-info-val-link { margin-top: 4px; }
        .ct-info-arrow { opacity: 0; transition: opacity 0.2s, color 0.2s; color: var(--muted); flex-shrink: 0; margin-top: 2px; }

        .ct-avail {
          display: flex; align-items: center; gap: 12px; padding: 16px 24px;
         
        }
        .ct-avail-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #2ecc71;
          flex-shrink: 0; box-shadow: 0 0 0 3px rgba(46,204,113,0.2);
          animation: ct-pulse 2s infinite;
        }
        @keyframes ct-pulse {
          0%,100% { box-shadow: 0 0 0 3px rgba(46,204,113,0.2); }
          50%      { box-shadow: 0 0 0 6px rgba(46,204,113,0.08); }
        }
        .ct-avail-text {
          font-family: 'DM Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.22em; text-transform: uppercase; color: var(--black);
        }
        .ct-avail-text span { color: var(--muted); }

        .ct-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line);
        }
        .ct-stat { padding: 20px 16px; border-right: 1px solid var(--line); text-align: center; }
        .ct-stat:last-child { border-right: none; }
        .ct-stat-num {
          font-family: 'Anton', sans-serif; font-size: 28px;
          color: var(--red); line-height: 1; display: block;
        }
        .ct-stat-lbl {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--muted); margin-top: 6px; display: block;
        }

        /* ── RIGHT PANEL — FORM ── */
        .ct-form-wrap {
          background: var(--black); padding: 48px; position: relative; overflow: hidden;
        }
        .ct-form-wrap::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 100%; height: 3px; background: var(--red);
        }
        .ct-form-head { margin-bottom: 36px; }
        .ct-form-eyebrow {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.32em;
          text-transform: uppercase; color: var(--red); display: block; margin-bottom: 10px;
        }
        .ct-form-title {
          font-family: 'Anton', sans-serif; font-size: 28px; letter-spacing: 0.04em;
          text-transform: uppercase; color: #fff; line-height: 1;
        }

        .ct-form { display: flex; flex-direction: column; gap: 3px; }
        .ct-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
        .ct-field { display: flex; flex-direction: column; gap: 0; }
        .ct-label {
          font-family: 'DM Sans', sans-serif; font-size: 9px; letter-spacing: 0.26em;
          text-transform: uppercase; color: rgba(255,255,255,0.3); padding: 10px 16px 0;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          border-bottom: none;
        }
        .ct-input, .ct-select, .ct-textarea {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
          color: #fff; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06); border-top: none;
          padding: 10px 16px 14px; outline: none;
          transition: background 0.2s, border-color 0.2s; width: 100%; -webkit-appearance: none;
        }
        .ct-input::placeholder, .ct-textarea::placeholder { color: rgba(255,255,255,0.18); }
        .ct-input:focus, .ct-select:focus, .ct-textarea:focus {
          background: rgba(200,55,45,0.06); border-color: rgba(200,55,45,0.4);
        }
        .ct-select { cursor: pointer; color: rgba(255,255,255,0.6); }
        .ct-select option { background: var(--black); color: #fff; }
        .ct-textarea { resize: none; height: 110px; }

        .ct-submit-row {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-top: 4px; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .ct-submit-note {
          font-family: 'DM Sans', sans-serif; font-size: 10px;
          letter-spacing: 0.14em; color: rgba(255,255,255,0.2); line-height: 1.6;
        }
        .ct-submit-btn {
          display: flex; align-items: center; gap: 10px; padding: 14px 28px;
          background: var(--red); border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 500;
          letter-spacing: 0.28em; text-transform: uppercase; cursor: pointer;
          white-space: nowrap; flex-shrink: 0; transition: background 0.2s, transform 0.15s;
        }
        .ct-submit-btn:hover:not(:disabled) { background: #a82d24; transform: translateY(-1px); }
        .ct-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .ct-error {
          font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.14em;
          color: #ff6b6b; background: rgba(255,107,107,0.08);
          border: 1px solid rgba(255,107,107,0.2); padding: 10px 16px; margin-top: 4px;
        }

        .ct-success {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 16px; padding: 48px 24px; text-align: center;
        }
        .ct-success-icon {
          width: 56px; height: 56px; border: 2px solid var(--red);
          display: flex; align-items: center; justify-content: center;
          color: var(--red); font-size: 24px;
        }
        .ct-success-h {
          font-family: 'Anton', sans-serif; font-size: 24px;
          letter-spacing: 0.06em; text-transform: uppercase; color: #fff;
        }
        .ct-success-p {
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: rgba(255,255,255,0.4); letter-spacing: 0.08em; line-height: 1.7;
        }

        /* ── BOTTOM STRIP ── */
        .ct-strip {
          max-width: 1280px; margin: 48px auto 0; padding: 0 80px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 24px; border-top: 1px solid var(--line); padding-top: 32px;
          position: relative; z-index: 1;
        }
        .ct-strip-text {
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted);
        }
        .ct-strip-links { display: flex; align-items: center; gap: 24px; }
        .ct-strip-link {
          font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--muted); text-decoration: none;
          display: flex; align-items: center; gap: 6px; transition: color 0.2s;
        }
        .ct-strip-link:hover { color: var(--red); }

        /* ── REVEAL ── */
        [data-reveal] {
          opacity: 0; transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.08s; }
        [data-reveal][data-d="2"] { transition-delay: 0.18s; }
        [data-reveal][data-d="3"] { transition-delay: 0.28s; }
        [data-reveal][data-d="4"] { transition-delay: 0.38s; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .ct-hdr, .ct-body, .ct-strip { padding-left: 48px; padding-right: 48px; }
        }
        @media (max-width: 900px) {
          .ct-body { grid-template-columns: 1fr; gap: 32px; }
          .ct-left { flex-direction: row; flex-wrap: wrap; }
          .ct-info-cards { flex: 1; min-width: 240px; }
          .ct-stats { flex: 1; min-width: 240px; }
          .ct-avail { width: 100%; }
        }
        @media (max-width: 768px) {
          .ct-hdr { flex-direction: column; align-items: flex-start; padding: 60px 28px 40px; }
          .ct-hdr-right { align-items: flex-start; }
          .ct-body { padding: 32px 28px 0; }
          .ct-strip { padding: 24px 28px 0; flex-direction: column; align-items: flex-start; }
          .ct-form-wrap { padding: 32px 24px; }
          .ct-form-row { grid-template-columns: 1fr; }
          .ct-left { flex-direction: column; }
          .ct-submit-row { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 480px) {
          .ct-hdr { padding: 48px 20px 32px; }
          .ct-body { padding: 24px 16px 0; }
          .ct-strip { padding: 20px 16px 0; }
        }
      `}</style>

      {/* ══ HEADER ══ */}
      <div className="ct-hdr">
        <div className="ct-hdr-left">
          <span className="ct-eyebrow" data-reveal>Get In Touch</span>
          <SplitText
            text="Let's Make"
            tag="div" className="ct-h1"
            delay={38} duration={1.2} ease="power3.out" splitType="chars"
            from={{ opacity: 0, y: 70 }} to={{ opacity: 1, y: 0 }}
            threshold={0.05} rootMargin="-20px"
            textAlign="left" hoverRoll hoverRollDirection="center"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
            
          />
          <SplitText
            text="Something."
            tag="div" className="ct-h1-accent"
            delay={30} duration={1.4} ease="power4.out" splitType="chars"
            from={{ opacity: 0, y: 80, skewX: 6 }} to={{ opacity: 1, y: 0, skewX: 0 }}
            threshold={0.05} rootMargin="-20px"
            textAlign="left" hoverRoll hoverRollDirection="left"
            autoRoll
            autoRollInterval={5500}
            autoRollDuration={620}
          />
          <p className="ct-hdr-desc" data-reveal data-d="1">
            Ready to elevate your brand with powerful visual storytelling?
            Share your vision with us—our team will connect with you to craft something impactful.
          </p>
        </div>
        <div className="ct-hdr-right" data-reveal data-d="2">
          <RollButton label="View Our Work" href="/studio" />
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="ct-body">

        {/* ── LEFT ── */}
        <div className="ct-left">
          <div className="ct-info-cards" data-reveal data-d="1">
            {contactInfo.map((info) => (
              <div key={info.label} className="ct-info-card">
                <span className="ct-info-icon">{info.icon}</span>
                <span className="ct-info-text">
                  <span className="ct-info-label">{info.label}</span>
                  {info.items.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      className="ct-info-val ct-info-val-link"
                    >
                      {item.value}
                    </a>
                  ))}
                </span>
                <span className="ct-info-arrow"><ArrowUpRight size={14} /></span>
              </div>
            ))}
          </div>

          <div className="ct-avail" data-reveal data-d="2">
            {/* <span className="ct-avail-dot" />
            <span className="ct-avail-text">
              Currently accepting new projects &nbsp;<span>— 2025</span>
            </span> */}
          </div>

          <div className="ct-stats" data-reveal data-d="3">
            <div className="ct-stat">
              <span className="ct-stat-num">10+</span>
              <span className="ct-stat-lbl">Years Active</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-num">50+</span>
              <span className="ct-stat-lbl">Team Members</span>
            </div>
            <div className="ct-stat">
              <span className="ct-stat-num">500+</span>
              <span className="ct-stat-lbl">Projects Done</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT — FORM ── */}
        <div className="ct-form-wrap" data-reveal data-d="2">
          <div className="ct-form-head">
            <span className="ct-form-eyebrow">Start a Project</span>
            <h2 className="ct-form-title">Tell Us About Your Vision</h2>
          </div>

          {sent ? (
            <div className="ct-success">
              <div className="ct-success-icon">✓</div>
              <p className="ct-success-h">Message Received</p>
              <p className="ct-success-p">
                Thank you for reaching out.<br />
                Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <div className="ct-form">
              <div className="ct-form-row">
                <div className="ct-field">
                  <label className="ct-label">Your Name *</label>
                  <input className="ct-input" type="text" name="name"
                    placeholder="John Smith" value={formData.name}
                    onChange={handleChange} autoComplete="off" />
                </div>
                <div className="ct-field">
                  <label className="ct-label">Email Address *</label>
                  <input className="ct-input" type="email" name="email"
                    placeholder="john@company.com" value={formData.email}
                    onChange={handleChange} autoComplete="off" />
                </div>
              </div>

              <div className="ct-form-row">
                <div className="ct-field">
                  <label className="ct-label">Company / Brand</label>
                  <input className="ct-input" type="text" name="company"
                    placeholder="Your company name" value={formData.company}
                    onChange={handleChange} autoComplete="off" />
                </div>
                <div className="ct-field">
                  <label className="ct-label">Service Needed</label>
                  <select className="ct-select" name="service"
                    value={formData.service} onChange={handleChange}>
                    <option value="">Select a service</option>
                    {services.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">Project Brief</label>
                <textarea className="ct-textarea" name="message"
                  placeholder="Tell us about your project, goals, timeline, and budget..."
                  value={formData.message} onChange={handleChange} />
              </div>

              {error && <p className="ct-error">{error}</p>}

              <div className="ct-submit-row">
                <p className="ct-submit-note">
                  We respond within 24 hours.<br />No spam, ever.
                </p>
                <button
                  className="ct-submit-btn"
                  onClick={handleSubmit}
                  disabled={sending || !formData.name || !formData.email}
                >
                  {sending ? <>Sending…</> : <><Send size={12} /> Send Message</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ BOTTOM STRIP ══ */}
      {/* <div className="ct-strip" data-reveal>
        <span className="ct-strip-text">© 2025 21FiftyOne. All rights reserved.</span>
        <div className="ct-strip-links">
          <a className="ct-strip-link" href="/privacy">Privacy Policy <ArrowUpRight size={10} /></a>
          <a className="ct-strip-link" href="/terms">Terms <ArrowUpRight size={10} /></a>
          <a className="ct-strip-link" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={10} /></a>
        </div>
      </div> */}

    </section>
  );
};

export default Contact;