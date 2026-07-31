"use client";

import React, { useEffect, useRef, useState } from "react";


const SHEET_ENDPOINT = process.env.NEXT_PUBLIC_SHEET_ENDPOINT ?? "";

interface ServiceItem {
  tc: string;
  title: string;
  desc: string;
  video: string;
}

const SERVICES: ServiceItem[] = [
  {
    tc: "00:01",
    title: "Visual Production",
    desc: "Brand videos, product visuals, campaign content and social media video assets with a clear visual style.",
    video: "/videos/banner/s-1.webm",
  },
  {
    tc: "00:02",
    title: "Movie Production",
    desc: "Short films, music-led stories, cinematic projects and narrative content with full production support.",
    video: "/videos/banner/s-2.webm",
  },
  {
    tc: "00:03",
    title: "Corporate Films",
    desc: "Company profile videos, leadership videos, training videos and interview-led business stories.",
    video: "/videos/banner/s-3.webm",
  },
  {
    tc: "00:04",
    title: "Commercial Production",
    desc: "Ad films, product commercials, launch videos and campaign creatives for marketing-focused brands.",
    video: "/videos/banner/s-4.webm",
  },
  {
    tc: "00:05",
    title: "AI Production",
    desc: "AI tools for creative production, concept visuals, AI video anchors and faster campaign assets.",
    video: "/videos/banner/s-5.webm",
  },
  {
    tc: "00:06",
    title: "Entertainment Events",
    desc: "Event visuals for launches, performances, brand experiences and cultural programs.",
    video: "/videos/banner/s-6.webm",
  },
];

const SERVICE_OPTIONS = [
  "Visual Production",
  "Movie Production",
  "Corporate Films",
  "Commercial Production",
  "AI Production",
  "Entertainment Events",
];

/* ---------- Service row with hover-video behaviour ---------- */
const ServiceRow: React.FC<ServiceItem> = ({ tc, title, desc, video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {
      /* autoplay may be blocked until user interacts once */
    });
  };
  const pause = () => videoRef.current?.pause();

  return (
    <div
      className="service-row"
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={() => videoRef.current?.play().catch(() => {})}
      onBlur={pause}
    >
      <video className="service-video" ref={videoRef} muted loop playsInline preload="none">
        <source src={video} type="video/webm" />
      </video>
      <div className="service-scrim"></div>
      <span className="tc">{tc}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
      <span className="arrow">↗</span>
    </div>
  );
};

/* ============================ PAGE ============================ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [popupSuccess, setPopupSuccess] = useState(false);
  const [bannerBtnText, setBannerBtnText] = useState("Request a Call Back");

  // NEW: submission-in-progress + error state for both forms
  const [bannerSubmitting, setBannerSubmitting] = useState(false);
  const [popupSubmitting, setPopupSubmitting] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [popupError, setPopupError] = useState(false);

  const popupFormRef = useRef<HTMLFormElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const bannerTimerRef = useRef<number | null>(null);

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    setPopupSuccess(false);
    setPopupError(false);
    popupFormRef.current?.reset();
  };

  /* header scroll state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll while modal is open */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  /* escape key closes modal */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* auto-open popup on page load */
  useEffect(() => {
    const t = window.setTimeout(() => setModalOpen(true), 700);
    return () => window.clearTimeout(t);
  }, []);

  /* scroll reveal animations */
  useEffect(() => {
    const revealTargets = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger"
    );

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

      revealTargets.forEach((el) => revealObserver.observe(el));
      return () => revealObserver.disconnect();
    } else {
      revealTargets.forEach((el) => el.classList.add("visible"));
    }
  }, []);

  /* clear pending timers on unmount */
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
      if (bannerTimerRef.current) window.clearTimeout(bannerTimerRef.current);
    };
  }, []);

  /* ---------------------------------------------------------
     Sends the form payload to the Google Apps Script Web App,
     which appends a row into the connected Google Sheet.
     --------------------------------------------------------- */
  const sendToSheet = async (payload: Record<string, unknown>) => {
    if (!SHEET_ENDPOINT) {
      console.error(
        "NEXT_PUBLIC_SHEET_ENDPOINT is not set. Add it to your .env.local file."
      );
      throw new Error("Missing SHEET_ENDPOINT");
    }
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      // Apps Script web apps don't return CORS headers fetch can
      // read, so we fire the request in no-cors mode. The row is
      // still written to the sheet — we just can't inspect the
      // response body here.
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  };

  /* form submit — now posts to Google Sheets via Apps Script */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    source: "banner" | "popup"
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      source,
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      service: formData.get("service"),
      message: formData.get("message") || "",
    };

    if (source === "popup") {
      setPopupSubmitting(true);
      setPopupError(false);
      try {
        await sendToSheet(payload);
        setPopupSuccess(true);
        closeTimerRef.current = window.setTimeout(closeModal, 2600);
      } catch (err) {
        console.error("Popup form submission failed:", err);
        setPopupError(true);
      } finally {
        setPopupSubmitting(false);
      }
    } else {
      setBannerSubmitting(true);
      setBannerError(false);
      try {
        await sendToSheet(payload);
        setBannerBtnText("Sent — Thank You!");
        form.reset();
        bannerTimerRef.current = window.setTimeout(
          () => setBannerBtnText("Request a Call Back"),
          2600
        );
      } catch (err) {
        console.error("Banner form submission failed:", err);
        setBannerError(true);
      } finally {
        setBannerSubmitting(false);
      }
    }
  };

  return (
    <>
      <style>{css}</style>

      {/* ===== HEADER ===== */}
      <header id="siteHeader" className={scrolled ? "scrolled" : ""}>
        <a href="#top" className="logo">
          <img src="/logo/2151-logo.png" alt="21Fiftyone logo" />
        </a>
        <nav>
          <ul>
            <li><a href="#top">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#process">Studio</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="nav-right">
          <a
            href="#"
            className="btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              openModal();
            }}
          >
            Enquire Now
          </a>
        </div>
        <button className="menu-toggle" aria-label="Menu" onClick={openModal}>
          <span></span><span></span><span></span>
        </button>
      </header>

      {/* ===== HERO + BANNER FORM ===== */}
      <section className="hero" id="top">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop"
        >
          <source src="/videos/banner/7011667_Film_Filming_1280x720.webm" type="video/webm" />
        </video>
        <div className="hero-scrim"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI Production House · Luxury &amp; Editorial</span>
            <h1>
              We Make <span>Culture.</span>
            </h1>
            <p>
              Video production company in Calicut crafting cinematic brand films, commercials,
              reels and digital stories that connect with people and leave a lasting impact.
            </p>
            <div className="hero-actions">
              <a href="#services" className="btn-solid">View Our Work</a>
              <a href="#contact" className="btn-ghost">Connect With The Studio</a>
            </div>
            <div className="reel-tags">
              <div><span>✦</span>Film Production</div>
              <div><span>✦</span>Commercial / Ad</div>
              <div><span>✦</span>Corporate Film</div>
              <div><span>✦</span>Event / Experience</div>
              <div><span>✦</span>AI Content</div>
              <div><span>✦</span>Photography</div>
            </div>
          </div>

          {/* BANNER ENQUIRY FORM */}
          <form className="banner-form" id="bannerForm" onSubmit={(e) => handleSubmit(e, "banner")}>
            <h3>Start Your Story</h3>
            <p className="sub">
              Tell us about your project — our studio will call you back within 24 hours.
            </p>

            <div className="field">
              <label htmlFor="b-name">Full Name</label>
              <input type="text" id="b-name" name="name" placeholder="Your name" required />
            </div>
            <div className="field">
              <label htmlFor="b-phone">Phone / WhatsApp</label>
              <input type="tel" id="b-phone" name="phone" placeholder="+91 00000 00000" required />
            </div>
            <div className="field">
              <label htmlFor="b-email">Email</label>
              <input type="email" id="b-email" name="email" placeholder="you@brand.com" required />
            </div>
            <div className="field">
              <label htmlFor="b-service">Project Type</label>
              <select id="b-service" name="service" defaultValue="" required>
                <option value="" disabled>Select a service</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-solid" disabled={bannerSubmitting}>
              {bannerSubmitting ? "Sending…" : bannerBtnText}
            </button>
            {bannerError && (
              <p className="form-note" style={{ color: "#e2231a" }}>
                Something went wrong. Please try again.
              </p>
            )}
            <p className="form-note">No spam. Just a conversation about your story.</p>
          </form>
        </div>
      </section>

      {/* ===== ABOUT (IMAGE SECTION) ===== */}
      <section className="about" id="about">
        <div className="container about-grid">
          <div className="about-frame reveal-left">
            <img src="/image/about-3.webp" alt="21Fiftyone behind the scenes on set" />
            <div className="corner tl"></div>
            <div className="corner br"></div>
            <p className="about-tag">
              "We don't just create visuals.<br />We craft stories that stay."
            </p>
          </div>
          <div className="reveal-right">
            <span className="eyebrow">The Origin</span>
            <h2>We Make Stories.</h2>
            <p>
              As a leading video production company in Calicut, we believe every story has the
              power to inspire, connect, and make an impact. We combine cinematic creativity with
              modern technology to create films and brand visuals that feel authentic, engaging,
              and memorable.
            </p>
            <p>
              From concept to completion, every project is crafted with passion, precision, and
              purpose — transforming ideas into visual experiences that leave a lasting impression.
            </p>
            <div className="stat-row">
              <div className="stat"><b>100+</b><span>Projects</span></div>
              <div className="stat"><b>25+</b><span>Brands</span></div>
              <div className="stat"><b>10+</b><span>Studio</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES (HOVER = VIDEO BACKGROUND) ===== */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">What We Do</span>
              <h2>Our Core Services</h2>
            </div>
            <p>
              Blending imagination, emotion and precision — to create stories that feel as powerful
              as they look. Hover a service to preview.
            </p>
          </div>

          <div className="service-list stagger">
            {SERVICES.map((s) => (
              <ServiceRow key={s.tc} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="process" id="process">
        <div className="container">
          <div className="reveal">
            <span className="eyebrow">How We Work</span>
            <h2 style={{ fontSize: "clamp(32px,4vw,50px)", fontStyle: "italic", marginTop: "14px" }}>
              The Process
            </h2>
          </div>
          <div className="process-grid stagger">
            <div className="process-step">
              <div className="tc">01 · Conceive</div>
              <h4>Understand</h4>
              <p>
                We understand your brand, audience, message, budget and final use case before
                suggesting a direction.
              </p>
            </div>
            <div className="process-step">
              <div className="tc">02 · Design</div>
              <h4>Shape</h4>
              <p>
                We shape the idea into a visual plan with scripts, mood references, shot flow and
                storyboards.
              </p>
            </div>
            <div className="process-step">
              <div className="tc">03 · Produce</div>
              <h4>Shoot</h4>
              <p>
                We handle the shoot with the right crew, equipment, lighting and on-location
                coordination.
              </p>
            </div>
            <div className="process-step">
              <div className="tc">04 · Deliver</div>
              <h4>Refine</h4>
              <p>
                We edit, grade and export final videos in formats suited for web, ads, reels and
                campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-strip" id="contact">
        <div className="container reveal-scale">
          <span className="eyebrow">Studio 2025 · Based Worldwide</span>
          <h2>
            Ready to Break<br />the Mold?
          </h2>
          <p>
            Let's collaborate on your next masterpiece. Our studio doors are always open for the
            brave.
          </p>
          <div className="cta-actions">
            <a
              href="#"
              className="btn-solid"
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
            >
              Connect With The Studio
            </a>
            <a href="#services" className="btn-ghost">View Our Work</a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="container reveal">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#top" className="logo">
                <img src="/logo/2151-logo.png" alt="21Fiftyone logo" />
              </a>
              <p>Elevating brands through the art of digital alchemy and technical precision.</p>
              <a className="mail" href="mailto:hello@21fiftyone.com">hello@21fiftyone.com</a>
            </div>
            <div>
              <h5>Studio</h5>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#process">Studio</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5>Services</h5>
              <ul>
                <li><a href="#services">Visual Production</a></li>
                <li><a href="#services">Movie Production</a></li>
                <li><a href="#services">Corporate Films</a></li>
                <li><a href="#services">AI Production</a></li>
              </ul>
            </div>
            <div>
              <h5>Policies</h5>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms &amp; Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 21FIFTYONE. All rights reserved. Thrissur / Kozhikode, IN — Est. 2006</span>
            <div className="socials">
              <a href="https://www.instagram.com/21fiftyone" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.facebook.com/share/1Aw4MkQKzk/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.behance.net/mindstorycreative" target="_blank" rel="noopener noreferrer">Behance</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING ENQUIRE BUTTON ===== */}
      <button className="float-btn" onClick={openModal}>
        <span className="dot"></span> Enquire Now
      </button>

      {/* ===== POPUP MODAL FORM ===== */}
      <div
        className={`modal-overlay${modalOpen ? " active" : ""}`}
        id="modalOverlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="modal-box">
          <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>

          <div id="modalFormWrap" style={{ display: popupSuccess ? "none" : "block" }}>
            <span className="eyebrow">Let's Create Together</span>
            <h3>Send an Enquiry</h3>
            <p className="sub">Share a few details and our studio will get back to you shortly.</p>

            <form id="popupForm" ref={popupFormRef} onSubmit={(e) => handleSubmit(e, "popup")}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="p-name">Full Name</label>
                  <input type="text" id="p-name" name="name" placeholder="Your name" required />
                </div>
                <div className="field">
                  <label htmlFor="p-email">Email</label>
                  <input type="email" id="p-email" name="email" placeholder="you@brand.com" required />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="p-phone">Phone / WhatsApp</label>
                  <input type="tel" id="p-phone" name="phone" placeholder="+91 00000 00000" required />
                </div>
                <div className="field">
                  <label htmlFor="p-service">Service Interested In</label>
                  <select id="p-service" name="service" defaultValue="" required>
                    <option value="" disabled>Select a service</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="p-message">Project Details</label>
                <textarea
                  id="p-message"
                  name="message"
                  rows={3}
                  placeholder="Tell us briefly about your project..."
                ></textarea>
              </div>
              <button type="submit" className="btn-solid" disabled={popupSubmitting}>
                {popupSubmitting ? "Sending…" : "Send Enquiry"}
              </button>
              {popupError && (
                <p className="form-note" style={{ color: "#e2231a" }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          <div className={`form-success${popupSuccess ? " active" : ""}`} id="formSuccess">
            <div className="check">✓</div>
            <h4>Enquiry Received</h4>
            <p>Thank you — our studio will reach out to you within 24 hours.</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================================================
   FULL ORIGINAL CSS — unchanged
   ========================================================= */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

:root{
  --bg:#ffffff;
  --bg-alt:#f6f6f6;
  --card:#ffffff;
  --line: rgba(0,0,0,0.10);
  --ivory:#121212;
  --muted:#6e6e6e;
  --gold:#e2231a;
  --gold-soft: rgba(226,35,26,0.08);
  --gold-dim:#f3aca6;
  --wine:#3a1f1c;
  --radius: 2px;
}
*{box-sizing:border-box; margin:0; padding:0;}
html{scroll-behavior:smooth;}
body{
  background:var(--bg);
  color:var(--ivory);
  font-family:'Jost', sans-serif;
  font-weight:300;
  line-height:1.6;
  overflow-x:hidden;
}
a{color:inherit; text-decoration:none;}
img{max-width:100%; display:block;}
h1,h2,h3,h4{
  font-family:'Cormorant Garamond', serif;
  font-weight:500;
  letter-spacing:0.01em;
}
.eyebrow{
  font-family:'Jost', sans-serif;
  font-size:11px;
  letter-spacing:0.35em;
  text-transform:uppercase;
  color:var(--gold);
  display:inline-flex;
  align-items:center;
  gap:10px;
}
.eyebrow::before{
  content:"";
  width:24px; height:1px;
  background:var(--gold);
}
.container{
  max-width:1240px;
  margin:0 auto;
  padding:0 32px;
}
section{position:relative;}

/* ===== SCROLL / ENTRANCE ANIMATIONS ===== */
.reveal{
  opacity:0;
  transform:translateY(44px);
  transition:opacity .9s cubic-bezier(.19,1,.22,1), transform .9s cubic-bezier(.19,1,.22,1);
  will-change:opacity, transform;
}
.reveal.visible{
  opacity:1;
  transform:translateY(0);
}
.reveal-left{
  opacity:0;
  transform:translateX(-50px);
  transition:opacity .9s cubic-bezier(.19,1,.22,1), transform .9s cubic-bezier(.19,1,.22,1);
}
.reveal-left.visible{opacity:1; transform:translateX(0);}
.reveal-right{
  opacity:0;
  transform:translateX(50px);
  transition:opacity .9s cubic-bezier(.19,1,.22,1), transform .9s cubic-bezier(.19,1,.22,1);
}
.reveal-right.visible{opacity:1; transform:translateX(0);}
.reveal-scale{
  opacity:0;
  transform:scale(0.94);
  transition:opacity .8s ease, transform .8s ease;
}
.reveal-scale.visible{opacity:1; transform:scale(1);}
.stagger > *{
  opacity:0;
  transform:translateY(30px);
  transition:opacity .7s ease, transform .7s ease;
}
.stagger.visible > *{opacity:1; transform:translateY(0);}
.stagger.visible > *:nth-child(1){transition-delay:.05s;}
.stagger.visible > *:nth-child(2){transition-delay:.15s;}
.stagger.visible > *:nth-child(3){transition-delay:.25s;}
.stagger.visible > *:nth-child(4){transition-delay:.35s;}
.stagger.visible > *:nth-child(5){transition-delay:.45s;}
.stagger.visible > *:nth-child(6){transition-delay:.55s;}

@keyframes heroFadeUp{
  from{opacity:0; transform:translateY(36px);}
  to{opacity:1; transform:translateY(0);}
}
.hero-copy .eyebrow{animation:heroFadeUp .9s cubic-bezier(.19,1,.22,1) both;}
.hero-copy h1{animation:heroFadeUp .9s cubic-bezier(.19,1,.22,1) .12s both;}
.hero-copy p{animation:heroFadeUp .9s cubic-bezier(.19,1,.22,1) .24s both;}
.hero-copy .hero-actions{animation:heroFadeUp .9s cubic-bezier(.19,1,.22,1) .36s both;}
.hero-copy .reel-tags{animation:heroFadeUp .9s cubic-bezier(.19,1,.22,1) .48s both;}
.banner-form{animation:heroFadeUp 1s cubic-bezier(.19,1,.22,1) .3s both;}

@media (prefers-reduced-motion: reduce){
  .reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger > *{
    opacity:1 !important; transform:none !important; transition:none !important;
  }
  .hero-copy .eyebrow, .hero-copy h1, .hero-copy p, .hero-copy .hero-actions, .hero-copy .reel-tags, .banner-form{
    animation:none !important;
  }
}

/* ===== NAV ===== */
header{
  position:fixed; top:0; left:0; right:0;
  z-index:200;
  display:flex; align-items:center; justify-content:space-between;
  padding:22px 40px;
  background:linear-gradient(to bottom, rgba(0,0,0,0.35), transparent);
  transition:background .3s ease, padding .3s ease;
}
header.scrolled{
  background:rgba(255,255,255,0.94);
  backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line);
  padding:14px 40px;
}
.logo{
  display:flex; align-items:center; gap:12px;
  font-family:'Cormorant Garamond', serif;
  font-size:24px;
  letter-spacing:0.08em;
}
header .logo{
  background:#ffffff;
  padding:8px 16px;
  border-radius:4px;
}
.logo img{height:38px; width:auto;}
nav ul{
  display:flex; gap:38px;
  list-style:none;
}
nav a{
  font-size:12px;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:#ffffff;
  position:relative;
  padding-bottom:4px;
  transition:color .3s ease;
}
header.scrolled nav a{color:var(--ivory);}
nav a::after{
  content:"";
  position:absolute; left:0; bottom:0;
  width:0; height:1px;
  background:var(--gold);
  transition:width .3s ease;
}
nav a:hover::after{width:100%;}
.nav-right{display:flex; align-items:center; gap:24px;}
.nav-right .btn-ghost{color:#ffffff; border-color:rgba(255,255,255,0.55);}
header.scrolled .nav-right .btn-ghost{color:var(--gold); border-color:var(--gold-dim);}
.btn-ghost{
  border:1px solid var(--gold-dim);
  color:var(--gold);
  padding:11px 22px;
  font-size:11px;
  letter-spacing:0.2em;
  text-transform:uppercase;
  transition:all .3s ease;
  white-space:nowrap;
}
.btn-ghost:hover{background:var(--gold); color:#ffffff !important; border-color:var(--gold) !important;}
.btn-solid{
  background:var(--gold);
  color:#ffffff;
  padding:14px 30px;
  font-size:11px;
  letter-spacing:0.2em;
  text-transform:uppercase;
  font-weight:500;
  border:1px solid var(--gold);
  transition:all .3s ease;
  cursor:pointer;
  display:inline-block;
}
.btn-solid:hover{background:transparent; color:var(--gold); transform:translateY(-2px);}
.btn-solid:disabled{opacity:0.6; cursor:not-allowed; transform:none;}
.menu-toggle{display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer;}
.menu-toggle span{width:24px; height:1px; background:#ffffff; transition:background .3s ease;}
header.scrolled .menu-toggle span{background:var(--ivory);}

/* ===== HERO (VIDEO BANNER) ===== */
.hero{
  min-height:100vh;
  display:flex;
  align-items:center;
  padding:160px 0 100px;
  position:relative;
  overflow:hidden;
  background:#0b0b0c;
}
.hero-video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  z-index:0;
}
.hero-scrim{
  position:absolute;
  inset:0;
  z-index:1;
  background:
    linear-gradient(180deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.40) 42%, rgba(10,10,10,0.82) 100%),
    linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 55%);
}
.hero-grid{
  position:relative; z-index:2;
  display:grid;
  grid-template-columns:1.15fr 0.85fr;
  gap:60px;
  align-items:start;
}
.hero-copy .eyebrow{margin-bottom:22px; color:var(--gold);}
.hero-copy h1{
  font-size:clamp(48px, 6.4vw, 92px);
  line-height:0.98;
  font-style:italic;
  color:#ffffff;
  margin-bottom:22px;
}
.hero-copy h1 span{color:var(--gold); font-style:normal;}
.hero-copy p{
  max-width:460px;
  color:rgba(255,255,255,0.78);
  font-size:16px;
  margin-bottom:34px;
}
.hero-actions{display:flex; gap:16px; align-items:center; flex-wrap:wrap;}
.hero-actions .btn-ghost{color:#ffffff; border-color:rgba(255,255,255,0.55);}
.hero-actions .btn-ghost:hover{background:var(--gold); border-color:var(--gold); color:#ffffff;}
.reel-tags{
  margin-top:56px;
  display:flex; flex-wrap:wrap; gap:0 28px;
  color:rgba(255,255,255,0.65);
  font-size:12px;
  letter-spacing:0.15em;
  text-transform:uppercase;
  border-top:1px solid rgba(255,255,255,0.18);
  padding-top:22px;
}
.reel-tags span{color:var(--gold); margin-right:6px;}

/* ---- Banner enquiry form ---- */
.banner-form{
  background:#ffffff;
  box-shadow:0 30px 70px rgba(20,18,14,0.10);
  border:1px solid var(--line);
  padding:38px 34px;
  position:relative;
}
.banner-form::before{
  content:"";
  position:absolute; top:0; left:0;
  width:100%; height:2px;
  background:linear-gradient(90deg, var(--gold), transparent);
}
.banner-form h3{
  font-size:26px;
  font-style:italic;
  margin-bottom:6px;
}
.banner-form .sub{
  color:var(--muted);
  font-size:13px;
  margin-bottom:26px;
}
.field{margin-bottom:16px;}
.field-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:0 20px;
}
.field-row .field{min-width:0;}
.field label{
  display:block;
  font-size:10px;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--muted);
  margin-bottom:8px;
}
.field input,
.field select,
.field textarea{
  width:100%;
  background:transparent;
  border:none;
  border-bottom:1px solid var(--line);
  color:var(--ivory);
  font-family:'Jost', sans-serif;
  font-size:14px;
  padding:9px 2px;
  outline:none;
  transition:border-color .3s ease;
}
.field select option{background:#ffffff; color:var(--ivory);}
.field input:focus,
.field select:focus,
.field textarea:focus{border-color:var(--gold);}
.field textarea{resize:none;}
.banner-form .btn-solid{width:100%; text-align:center; margin-top:6px;}
.form-note{
  font-size:11px;
  color:var(--muted);
  margin-top:14px;
  text-align:center;
  letter-spacing:0.03em;
}

/* ===== ABOUT (IMAGE SECTION) ===== */
.about{
  padding:130px 0;
  border-top:1px solid var(--line);
}
.about-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:70px;
  align-items:center;
}
.about h2{
  font-size:clamp(34px,4vw,52px);
  font-style:italic;
  line-height:1.1;
  margin:16px 0 24px;
}
.about p{color:var(--muted); font-size:15px; margin-bottom:18px; max-width:520px;}
.stat-row{
  display:flex;
  gap:48px;
  margin-top:36px;
  padding-top:30px;
  border-top:1px solid var(--line);
}
.stat b{
  display:block;
  font-family:'Cormorant Garamond', serif;
  font-size:44px;
  color:var(--gold);
  font-style:italic;
}
.stat span{font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--muted);}

.about-frame{
  aspect-ratio:4/5;
  position:relative;
  overflow:hidden;
  border:1px solid var(--line);
  display:flex; align-items:flex-end;
  padding:26px;
  background:#f0ede4;
}
.about-frame img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  z-index:0;
  transition:transform .8s ease;
}
.about-frame:hover img{transform:scale(1.06);}
.about-frame::after{
  content:"";
  position:absolute; inset:0;
  background:linear-gradient(180deg, transparent 45%, rgba(8,8,8,0.72) 100%);
  z-index:1;
  pointer-events:none;
}
.about-frame .corner{
  position:absolute; width:22px; height:22px;
  border:1px solid var(--gold);
  z-index:2;
}
.about-frame .tl{top:14px; left:14px; border-right:none; border-bottom:none;}
.about-frame .br{bottom:14px; right:14px; border-left:none; border-top:none;}
.about-frame .about-tag{
  position:relative;
  z-index:2;
  color:#ffffff;
  font-family:'Cormorant Garamond', serif;
  font-style:italic;
  font-size:20px;
  line-height:1.3;
}

/* ===== SERVICES (HOVER VIDEO) ===== */
.services{
  padding:130px 0;
  background:var(--bg-alt);
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
}
.section-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:40px;
  margin-bottom:64px;
  flex-wrap:wrap;
}
.section-head h2{
  font-size:clamp(32px,4vw,50px);
  font-style:italic;
  margin-top:14px;
}
.section-head p{color:var(--muted); max-width:340px; font-size:14px;}
.service-list{border-top:1px solid var(--line);}
.service-row{
  position:relative;
  overflow:hidden;
  display:grid;
  grid-template-columns:90px 1fr 1fr 40px;
  gap:24px;
  align-items:center;
  min-height:220px;
  padding:64px 28px;
  border-bottom:1px solid var(--line);
  isolation:isolate;
  transition:padding .35s ease;
}
.service-row > *{position:relative; z-index:2;}
.service-video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  z-index:0;
  opacity:0;
  transform:scale(1.04);
  transition:opacity .5s ease, transform .6s ease;
  pointer-events:none;
}
.service-scrim{
  position:absolute;
  inset:0;
  z-index:1;
  background:linear-gradient(90deg, rgba(6,6,6,0.82) 0%, rgba(6,6,6,0.45) 65%, rgba(6,6,6,0.20) 100%);
  opacity:0;
  transition:opacity .45s ease;
  pointer-events:none;
}
.service-row:hover{padding-left:38px;}
.service-row:hover .service-video{opacity:1; transform:scale(1);}
.service-row:hover .service-scrim{opacity:1;}
.service-row .tc{
  font-family:'Jost';
  font-size:12px;
  color:var(--gold);
  letter-spacing:0.1em;
  transition:color .35s ease;
}
.service-row h4{
  font-size:28px;
  font-style:italic;
  font-weight:500;
  transition:color .35s ease;
}
.service-row p{color:var(--muted); font-size:14px; transition:color .35s ease;}
.service-row .arrow{
  font-size:22px; color:var(--gold);
  transition:transform .3s ease, color .35s ease;
}
.service-row:hover .arrow{transform:translate(4px,-4px);}
.service-row:hover .tc{color:#ffffff;}
.service-row:hover h4{color:#ffffff;}
.service-row:hover p{color:rgba(255,255,255,0.82);}
.service-row:hover .arrow{color:#ffffff;}

/* ===== PROCESS ===== */
.process{padding:130px 0;}
.process-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:1px;
  background:var(--line);
  border:1px solid var(--line);
  margin-top:60px;
}
.process-step{
  background:var(--bg);
  padding:40px 30px;
  transition:background .35s ease, transform .35s ease;
}
.process-step:hover{background:var(--gold-soft); transform:translateY(-6px);}
.process-step .tc{
  font-family:'Cormorant Garamond', serif;
  font-style:italic;
  color:var(--gold);
  font-size:15px;
  margin-bottom:30px;
}
.process-step h4{font-size:22px; margin-bottom:14px; letter-spacing:0.05em;}
.process-step p{color:var(--muted); font-size:13.5px;}

/* ===== CTA STRIP ===== */
.cta-strip{
  padding:140px 0;
  text-align:center;
  background:
    radial-gradient(ellipse 70% 90% at 50% 0%, rgba(226,35,26,0.08), transparent 65%),
    var(--bg-alt);
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
}
.cta-strip .eyebrow{justify-content:center;}
.cta-strip .eyebrow::before{display:none;}
.cta-strip h2{
  font-size:clamp(38px,6vw,72px);
  font-style:italic;
  max-width:840px;
  margin:22px auto 26px;
  line-height:1.05;
}
.cta-strip p{color:var(--muted); max-width:480px; margin:0 auto 40px; font-size:15px;}
.cta-actions{display:flex; gap:18px; justify-content:center; flex-wrap:wrap;}

/* ===== FOOTER ===== */
footer{padding:90px 0 30px;}
.footer-grid{
  display:grid;
  grid-template-columns:1.4fr 1fr 1fr 1fr;
  gap:40px;
  padding-bottom:60px;
  border-bottom:1px solid var(--line);
}
.footer-brand .logo{margin-bottom:18px;}
.footer-brand p{color:var(--muted); font-size:13.5px; max-width:300px; margin-bottom:18px;}
.footer-brand a.mail{color:var(--gold); font-size:14px;}
footer h5{
  font-size:11px; letter-spacing:0.18em; text-transform:uppercase;
  color:var(--muted); margin-bottom:20px;
}
footer ul{list-style:none;}
footer li{margin-bottom:12px;}
footer ul a{font-size:13.5px; color:var(--ivory); opacity:0.85; transition:opacity .25s ease, color .25s ease;}
footer ul a:hover{color:var(--gold); opacity:1;}
.footer-bottom{
  display:flex; justify-content:space-between; align-items:center;
  padding-top:26px;
  font-size:12px;
  color:var(--muted);
  flex-wrap:wrap; gap:12px;
}
.socials{display:flex; gap:18px;}
.socials a{transition:color .25s ease;}
.socials a:hover{color:var(--gold);}

/* ===== FLOATING ENQUIRE BUTTON ===== */
.float-btn{
  position:fixed;
  right:28px; bottom:28px;
  z-index:150;
  background:var(--gold);
  color:#ffffff;
  border:none;
  padding:16px 26px;
  font-family:'Jost';
  font-size:11px;
  letter-spacing:0.2em;
  text-transform:uppercase;
  font-weight:600;
  cursor:pointer;
  display:flex; align-items:center; gap:10px;
  box-shadow:0 10px 30px rgba(226,35,26,0.35);
  transition:transform .25s ease, background .25s ease;
}
.float-btn:hover{transform:translateY(-3px); background:#b81b14;}
.float-btn .dot{
  width:7px; height:7px; border-radius:50%;
  background:#ffffff;
  animation:pulse 1.6s infinite;
}
@keyframes pulse{
  0%,100%{opacity:1;} 50%{opacity:0.25;}
}

/* ===== MODAL POPUP ===== */
.modal-overlay{
  position:fixed; inset:0;
  background:rgba(6,6,7,0.82);
  backdrop-filter:blur(6px);
  z-index:300;
  display:flex;
  align-items:center;
  justify-content:center;
  opacity:0;
  pointer-events:none;
  transition:opacity .35s ease;
  padding:20px;
}
.modal-overlay.active{opacity:1; pointer-events:auto;}
.modal-box{
  background:#ffffff;
  border:1px solid var(--line);
  box-shadow:0 30px 80px rgba(20,18,14,0.18);
  width:100%;
  max-width:600px;
  padding:50px 56px;
  position:relative;
  transform:translateY(24px) scale(0.98);
  transition:transform .35s ease;
  max-height:90vh;
  overflow-y:auto;
}
.modal-overlay.active .modal-box{transform:translateY(0) scale(1);}
.modal-box::before{
  content:"";
  position:absolute; top:0; left:0;
  width:100%; height:2px;
  background:linear-gradient(90deg, var(--gold), transparent);
}
.modal-close{
  position:absolute; top:20px; right:20px;
  background:none; border:none;
  color:var(--muted);
  font-size:22px;
  cursor:pointer;
  line-height:1;
  transition:color .2s ease, transform .2s ease;
}
.modal-close:hover{color:var(--gold); transform:rotate(90deg);}
.modal-box .eyebrow{margin-bottom:14px;}
.modal-box h3{
  font-size:32px;
  font-style:italic;
  margin-bottom:8px;
}
.modal-box .sub{color:var(--muted); font-size:13.5px; margin-bottom:28px;}
.modal-box .btn-solid{width:100%; text-align:center; margin-top:8px;}
.form-success{
  display:none;
  text-align:center;
  padding:30px 0;
}
.form-success.active{display:block;}
.form-success .check{
  width:56px; height:56px;
  border:1px solid var(--gold);
  border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  margin:0 auto 20px;
  color:var(--gold);
  font-size:24px;
}
.form-success h4{font-size:24px; font-style:italic; margin-bottom:8px;}
.form-success p{color:var(--muted); font-size:13.5px;}

/* ===== RESPONSIVE ===== */
@media(max-width:960px){
  .hero-grid{grid-template-columns:1fr;}
  .about-grid{grid-template-columns:1fr;}
  .about-frame{aspect-ratio:16/9; order:-1;}
  .process-grid{grid-template-columns:repeat(2,1fr);}
  .footer-grid{grid-template-columns:1fr 1fr;}
  .service-row{grid-template-columns:50px 1fr 24px; padding:48px 18px; min-height:180px;}
  .service-row p{display:none;}
}
@media(max-width:720px){
  header{padding:18px 20px;}
  nav, .nav-right .btn-ghost{display:none;}
  .menu-toggle{display:flex;}
  .container{padding:0 20px;}
  .hero{padding:130px 0 70px;}
  .hero-copy p{max-width:100%;}
  .stat-row{flex-wrap:wrap; gap:28px;}
  .process-grid{grid-template-columns:1fr;}
  .footer-grid{grid-template-columns:1fr;}
  .float-btn{right:16px; bottom:16px; padding:14px 20px; font-size:10px;}
  .modal-box{padding:36px 24px;}
  .service-row{min-height:160px; padding:38px 16px;}
  .banner-form{padding:30px 22px;}
  .field-row{grid-template-columns:1fr;}
  .about{padding:90px 0;}
  .services{padding:90px 0;}
  .process{padding:90px 0;}
  .cta-strip{padding:100px 0;}
  footer{padding:70px 0 24px;}
}
@media(max-width:480px){
  .hero-copy h1{font-size:clamp(38px,11vw,56px);}
  .logo img{height:30px;}
  header .logo{padding:6px 12px;}
  .hero-actions{flex-direction:column; align-items:stretch;}
  .hero-actions a{text-align:center;}
  .reel-tags{gap:8px 18px; font-size:11px;}
  .cta-actions{flex-direction:column; align-items:stretch;}
  .cta-actions a{text-align:center;}
  .stat-row{gap:20px;}
  .stat b{font-size:34px;}
  .footer-bottom{flex-direction:column; align-items:flex-start;}
  .modal-box{padding:30px 18px;}
}
@media (prefers-reduced-motion: reduce){
  *{animation:none !important; transition:none !important;}
}
@media (hover:none){
  /* touch devices: no hover video trigger, just keep static row */
  .service-video, .service-scrim{display:none;}
}
`;