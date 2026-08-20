"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/* =========================================================
   21FIFTYONE — THANK YOU PAGE
   Route: /thank-you
   Query params (all optional, set by the enquiry forms):
     ?name=Arjun            -> personalises the headline
     ?service=Corporate%20Films
     ?from=banner|popup     -> shown in the "slate" detail strip
   ========================================================= */

const WHATSAPP_NUMBER = "919999999999"; // <- replace with the studio number (country code, no +)
const STUDIO_EMAIL = "hello@21fiftyone.com";

const NEXT_STEPS = [
  {
    tc: "00:01",
    title: "We read your brief",
    desc: "Your enquiry lands directly with our producers, not a generic inbox.",
  },
  {
    tc: "00:02",
    title: "We call you back",
    desc: "Expect a call or WhatsApp from the studio within 24 working hours.",
  },
  {
    tc: "00:03",
    title: "We scope the story",
    desc: "A short conversation about goals, references and budget — then a proposal.",
  },
];

function ThankYouInner() {
  const params = useSearchParams();
  const name = (params.get("name") || "").trim();
  const service = (params.get("service") || "").trim();
  const from = params.get("from") === "popup" ? "Enquiry form" : "Hero form";

  const firstName = name.split(/\s+/)[0];
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    /* reference stamp — date + time the slate was "clapped" */
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setStamp(
      `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`
    );

    /* Conversion tracking — fires once per landing on this page.
       Works with GA4 / Google Ads gtag, Meta Pixel if present. */
    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };
    w.gtag?.("event", "generate_lead", { service, form: from });
    w.fbq?.("track", "Lead", { content_name: service });
  }, [service, from]);

  return (
    <>
      <style>{css}</style>

      <header className="ty-header">
        <a href="/" className="logo">
          <img src="/logo/2151-logo.png" alt="21Fiftyone logo" />
        </a>
        <a href="/" className="btn-ghost">Back to site</a>
      </header>

      <main className="ty">
        {/* ---- the slate ---- */}
        <section className="slate">
          <div className="slate-bar" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>

          <div className="slate-body">
            <span className="eyebrow">Take 01 · Enquiry received</span>
            <h1>
              {firstName ? (
                <>
                  Thank you, <span>{firstName}.</span>
                </>
              ) : (
                <>
                  Thank <span>you.</span>
                </>
              )}
            </h1>
            <p className="lede">
              Your story is on our desk. A producer from the studio will reach out within
              24 hours to talk it through.
            </p>

            <dl className="slate-meta">
              <div>
                <dt>Project</dt>
                <dd>{service || "To be discussed"}</dd>
              </div>
              <div>
                <dt>Received via</dt>
                <dd>{from}</dd>
              </div>
              <div>
                <dt>Logged</dt>
                <dd>{stamp || "—"}</dd>
              </div>
            </dl>

            <div className="ty-actions">
              <a
                className="btn-solid"
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hi 21Fiftyone, I just sent an enquiry${service ? ` about ${service}` : ""}${
                    firstName ? ` (${name})` : ""
                  }.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Skip the wait — WhatsApp us
              </a>
              <a className="btn-ghost" href="/#services">See our work</a>
            </div>
          </div>
        </section>

        {/* ---- what happens next ---- */}
        <section className="next">
          <div className="section-head">
            <span className="eyebrow">What happens next</span>
            <h2>Three short cuts.</h2>
          </div>
          <ol className="next-list">
            {NEXT_STEPS.map((s) => (
              <li key={s.tc}>
                <span className="tc">{s.tc}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <footer className="ty-footer">
          <span>
            Didn't mean to send this, or need to add something?{" "}
            <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
          </span>
          <div className="socials">
            <a href="https://www.instagram.com/21fiftyone" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/share/1Aw4MkQKzk/" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.behance.net/mindstorycreative" target="_blank" rel="noopener noreferrer">Behance</a>
          </div>
        </footer>
      </main>
    </>
  );
}

/* useSearchParams must be wrapped in Suspense in the App Router */
export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouInner />
    </Suspense>
  );
}

/* ============================ CSS ============================ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

:root{
  --bg:#ffffff; --bg-alt:#f6f6f6; --line:rgba(0,0,0,0.10);
  --ivory:#121212; --muted:#6e6e6e;
  --gold:#e2231a; --gold-soft:rgba(226,35,26,0.08); --gold-dim:#f3aca6;
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ivory);font-family:'Jost',sans-serif;font-weight:300;line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
h1,h2,h4{font-family:'Cormorant Garamond',serif;font-weight:500}
.eyebrow{font-size:11px;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);display:inline-flex;align-items:center;gap:10px}
.eyebrow::before{content:"";width:24px;height:1px;background:var(--gold)}
.btn-ghost{border:1px solid var(--gold-dim);color:var(--gold);padding:11px 22px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;transition:all .3s ease;white-space:nowrap;display:inline-block}
.btn-ghost:hover{background:var(--gold);color:#fff;border-color:var(--gold)}
.btn-solid{background:var(--gold);color:#fff;padding:14px 30px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:500;border:1px solid var(--gold);transition:all .3s ease;display:inline-block}
.btn-solid:hover{background:transparent;color:var(--gold);transform:translateY(-2px)}
a:focus-visible{outline:2px solid var(--gold);outline-offset:3px}

.ty-header{display:flex;align-items:center;justify-content:space-between;padding:22px 40px;border-bottom:1px solid var(--line)}
.logo img{height:38px;width:auto}

.ty{max-width:1240px;margin:0 auto;padding:0 32px}

/* ---- slate ---- */
.slate{margin:80px 0 0;border:1px solid var(--line);background:#fff;box-shadow:0 30px 70px rgba(20,18,14,.08);animation:fadeUp .9s cubic-bezier(.19,1,.22,1) both}
.slate-bar{display:grid;grid-template-columns:repeat(8,1fr);height:14px;overflow:hidden;transform-origin:left center;animation:clap .55s cubic-bezier(.34,1.56,.64,1) .25s both}
.slate-bar span:nth-child(odd){background:var(--ivory)}
.slate-bar span:nth-child(even){background:var(--gold)}
.slate-body{padding:64px 64px 56px}
.slate h1{font-size:clamp(44px,6vw,84px);line-height:.98;font-style:italic;margin:22px 0 20px}
.slate h1 span{color:var(--gold);font-style:normal}
.lede{max-width:520px;color:var(--muted);font-size:16px;margin-bottom:40px}
.slate-meta{display:grid;grid-template-columns:repeat(3,auto);gap:40px;justify-content:start;padding:24px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:36px}
.slate-meta dt{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.slate-meta dd{font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic}
.ty-actions{display:flex;gap:16px;flex-wrap:wrap;align-items:center}

/* ---- next steps ---- */
.next{padding:110px 0 90px}
.section-head h2{font-size:clamp(32px,4vw,50px);font-style:italic;margin-top:14px}
.next-list{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin-top:48px}
.next-list li{background:var(--bg);padding:40px 30px;transition:background .35s ease,transform .35s ease}
.next-list li:hover{background:var(--gold-soft);transform:translateY(-6px)}
.next-list .tc{font-size:12px;color:var(--gold);letter-spacing:.1em;display:block;margin-bottom:26px}
.next-list h4{font-size:24px;font-style:italic;margin-bottom:12px}
.next-list p{color:var(--muted);font-size:14px}

.ty-footer{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding:26px 0 40px;border-top:1px solid var(--line);font-size:12.5px;color:var(--muted)}
.ty-footer a{color:var(--gold)}
.socials{display:flex;gap:18px}
.socials a{color:var(--muted);transition:color .25s ease}
.socials a:hover{color:var(--gold)}

@keyframes fadeUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
@keyframes clap{from{transform:scaleX(0)}to{transform:scaleX(1)}}

@media(max-width:960px){.next-list{grid-template-columns:1fr}}
@media(max-width:720px){
  .ty-header{padding:18px 20px}.logo img{height:30px}
  .ty{padding:0 20px}.slate{margin-top:40px}.slate-body{padding:40px 24px 36px}
  .slate-meta{grid-template-columns:1fr;gap:18px}
  .ty-actions{flex-direction:column;align-items:stretch}.ty-actions a{text-align:center}
  .next{padding:70px 0 60px}
  .ty-footer{flex-direction:column;align-items:flex-start}
}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;