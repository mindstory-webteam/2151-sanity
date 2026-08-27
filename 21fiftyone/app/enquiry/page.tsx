"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // NEW


const SHEET_ENDPOINT = process.env.NEXT_PUBLIC_SHEET_ENDPOINT ?? "";

/* =========================================================
   ZOHO BIGIN — WEB TO RECORD CONFIG
   ---------------------------------------------------------
   Values below come from the "2151 Get Quote" Bigin webform.
   The webform script is served from bigin.zoho.com, so the
   POST endpoint is https://bigin.zoho.com/crm/WebToRecordForm
   (.in / .eu / .com.au accounts use a different domain.)
   ========================================================= */
const BIGIN_ACTION = "https://bigin.zoho.com/crm/WebToRecordForm";
const BIGIN_XNQSJSDP =
  "02c968b7a944c9b62a557ab89f5d5af9aa2368d873db16baa0b917eace765312";
const BIGIN_XMIWTLD =
  "4c114c3a8f05e6c49db3b02d6c880c8a0895a98f5c56091f114c0840fe253a017556f596a0fe7b09a643bfd0ee3b1ce8";
const BIGIN_ACTION_TYPE = "UG90ZW50aWFscw==";
const BIGIN_PIPELINE = "Sales Pipeline Standard 2";
const BIGIN_STAGE = "Qualification";
const BIGIN_LEAD_SOURCE = "Official Website";
const BIGIN_IFRAME_NAME = "bigin_post_frame";

/* NEW: where users land after a successful enquiry */
const THANK_YOU_PATH = "/thank-you";

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

/* Bigin picklist values for POTENTIALCF3 / POTENTIALCF2 — must match exactly */
const BUDGET_OPTIONS = [
  "Below ₹25K",
  "₹25K–₹50K",
  "₹50K–₹1L",
  "₹1L–₹3L",
  "₹3L+",
];

const TIMELINE_OPTIONS = [
  "Immediately",
  "Within 30 days",
  "1–3 months",
  "Just Exploring",
];

/* Website service names -> Bigin "Service Interested In?" picklist values.
   Bigin rejects any value that is not in the picklist, so we translate.
   The original selection is still kept inside the Description. */
const SERVICE_TO_BIGIN: Record<string, string> = {
  "Visual Production": "Video Production",
  "Movie Production": "Video Production",
  "Corporate Films": "Video Production",
  "Commercial Production": "Video Production",
  "AI Production": "AI Videos",
  "Entertainment Events": "Video Production",
};

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

/* =========================================================
   TRACKING — UTM, click IDs and referrer attribution
   ---------------------------------------------------------
   Rules this follows:

   1. A visit that arrives with ANY utm_* or ad click id starts
      a NEW touch, and the whole set is replaced. Merging a new
      utm_source onto an old utm_medium is how campaign reports
      end up lying, so we never do it.
   2. A visit with no campaign data keeps whatever the session
      already had — browsing around the site does not wipe the
      original attribution.
   3. When there is no utm_source at all we infer source/medium
      from the click id or the referring host, instead of
      dumping everything into "direct".
   4. First touch is kept in localStorage for 90 days, so a lead
      who found you on Google in March and enquired in May still
      credits Google.
   5. Every value is clipped to 255 characters — that is the max
      length of the single-line Bigin fields, and anything longer
      risks the record being rejected.
   ========================================================= */
const TRACKING_KEY = "f21_tracking";
const FIRST_TOUCH_KEY = "f21_first_touch";
const FIRST_TOUCH_TTL = 90 * 24 * 60 * 60 * 1000; // 90 days

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const CLICK_ID_KEYS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
] as const;

const SEARCH_HOSTS = [
  "google.",
  "bing.",
  "yahoo.",
  "duckduckgo.",
  "ecosia.",
  "yandex.",
  "baidu.",
  "brave.",
];

const SOCIAL_HOSTS = [
  "facebook.",
  "instagram.",
  "linkedin.",
  "youtube.",
  "pinterest.",
  "threads.",
  "twitter.",
  "x.com",
  "t.co",
  "whatsapp.",
  "reddit.",
  "snapchat.",
  "tiktok.",
];

interface TrackingData {
  leadPageUrl: string;
  landingPageUrl: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  gclid: string;
  fbclid: string;
  msclkid: string;
  firstTouchSource: string;
  firstTouchMedium: string;
  firstTouchCampaign: string;
  firstTouchDate: string;
}

const EMPTY_TRACKING: TrackingData = {
  leadPageUrl: "",
  landingPageUrl: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  gclid: "",
  fbclid: "",
  msclkid: "",
  firstTouchSource: "",
  firstTouchMedium: "",
  firstTouchCampaign: "",
  firstTouchDate: "",
};

/* Bigin single-line fields are capped at 255 characters */
const clip = (value: string | null | undefined, max = 255) =>
  (value ?? "").trim().slice(0, max);

const readStore = (store: Storage, key: string): Record<string, unknown> | null => {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeStore = (store: Storage, key: string, value: unknown) => {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / storage full — tracking is best effort */
  }
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
};

const hostMatches = (host: string, list: string[]) =>
  list.some((entry) => host === entry || host.includes(entry));

/* Work out source/medium when the link had no utm_source on it */
const inferSourceMedium = (params: URLSearchParams, referrer: string) => {
  if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) {
    return { source: "google", medium: "cpc" };
  }
  if (params.get("msclkid")) return { source: "bing", medium: "cpc" };
  if (params.get("fbclid")) return { source: "facebook", medium: "social" };
  if (params.get("ttclid")) return { source: "tiktok", medium: "social" };

  const host = hostOf(referrer);
  /* no referrer, or an internal link = someone who typed the URL,
     used a bookmark, or came from an app with no referrer */
  if (!host || host === hostOf(window.location.href)) {
    return { source: "direct", medium: "none" };
  }
  if (hostMatches(host, SEARCH_HOSTS)) return { source: host, medium: "organic" };
  if (hostMatches(host, SOCIAL_HOSTS)) return { source: host, medium: "social" };
  return { source: host, medium: "referral" };
};

/* Build a complete, self-consistent touch from the current URL */
const buildTouch = (params: URLSearchParams, referrer: string): TrackingData => {
  const inferred = inferSourceMedium(params, referrer);
  const href = clip(window.location.href);

  return {
    ...EMPTY_TRACKING,
    leadPageUrl: href,
    landingPageUrl: href,
    referrer: clip(referrer),
    utmSource: clip(params.get("utm_source") || inferred.source),
    utmMedium: clip(params.get("utm_medium") || inferred.medium),
    utmCampaign: clip(params.get("utm_campaign")),
    utmContent: clip(params.get("utm_content")),
    utmTerm: clip(params.get("utm_term")),
    gclid: clip(
      params.get("gclid") || params.get("gbraid") || params.get("wbraid")
    ),
    fbclid: clip(params.get("fbclid")),
    msclkid: clip(params.get("msclkid")),
  };
};

/* Map the traffic back onto Bigin's "Lead Source" picklist.
   Only values that exist in the picklist may be returned — Bigin
   silently drops the field otherwise. */
const biginLeadSource = (t: TrackingData): string => {
  const source = t.utmSource.toLowerCase();
  const medium = t.utmMedium.toLowerCase();
  const isPaid = /cpc|ppc|paid|ads|sem|display|banner/.test(medium);

  if (t.gclid || (source.includes("google") && isPaid)) return "Google Ads";
  if (t.msclkid) return "Advertisement";
  if (
    isPaid &&
    (source.includes("facebook") ||
      source.includes("instagram") ||
      source.includes("meta") ||
      source === "fb" ||
      source === "ig")
  ) {
    return "Meta Ads";
  }
  if (source.includes("whatsapp")) {
    return t.utmCampaign ? "WhatsApp Campaign" : "WhatsApp Organic";
  }
  return BIGIN_LEAD_SOURCE; // Official Website
};

/* ============================ PAGE ============================ */
export default function Home() {
  const router = useRouter(); // NEW

  const [scrolled, setScrolled] = useState(false);

  // submission-in-progress + error state for the enquiry form
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  // campaign tracking captured from the URL
  const [tracking, setTracking] = useState<TrackingData>(EMPTY_TRACKING);

  /* Debug mode: open the page with ?biginDebug=1 to show the normally
     hidden iframe and skip the thank-you redirect, so Zoho's actual
     response (success page or error message) stays on screen. */
  const [debugBigin, setDebugBigin] = useState(false);

  useEffect(() => {
    setDebugBigin(
      new URLSearchParams(window.location.search).get("biginDebug") === "1"
    );
  }, []);

  /* header scroll state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* NEW: warm up the thank-you route so the redirect is instant */
  useEffect(() => {
    router.prefetch(THANK_YOU_PATH);
  }, [router]);

  /* ---------------------------------------------------------
     Capture campaign attribution.

     Arriving with utm_* or a click id = new touch, replaces the
     stored set completely. Arriving with nothing = keep what the
     session already holds, so internal navigation never erases
     the campaign that actually brought the visitor in.
     --------------------------------------------------------- */
  useEffect(() => {
    const href = clip(window.location.href);

    try {
      const params = new URLSearchParams(window.location.search);

      const isNewTouch = [...UTM_KEYS, ...CLICK_ID_KEYS].some(
        (key) => (params.get(key) ?? "").trim() !== ""
      );

      const saved = readStore(window.sessionStorage, TRACKING_KEY) as
        | Partial<TrackingData>
        | null;

      const data: TrackingData =
        isNewTouch || !saved
          ? buildTouch(params, document.referrer)
          : { ...EMPTY_TRACKING, ...saved };

      /* the enquiry may be sent from a different page than the one
         they landed on — record both */
      data.leadPageUrl = href;
      if (!data.landingPageUrl) data.landingPageUrl = href;

      /* first touch: written once, then left alone for 90 days */
      const firstRaw = readStore(window.localStorage, FIRST_TOUCH_KEY) as
        | { source?: string; medium?: string; campaign?: string; savedAt?: number }
        | null;

      const firstIsFresh =
        firstRaw &&
        typeof firstRaw.savedAt === "number" &&
        Date.now() - firstRaw.savedAt < FIRST_TOUCH_TTL;

      if (firstIsFresh && firstRaw) {
        data.firstTouchSource = clip(firstRaw.source);
        data.firstTouchMedium = clip(firstRaw.medium);
        data.firstTouchCampaign = clip(firstRaw.campaign);
        data.firstTouchDate = new Date(firstRaw.savedAt as number)
          .toISOString()
          .slice(0, 10);
      } else {
        const savedAt = Date.now();
        writeStore(window.localStorage, FIRST_TOUCH_KEY, {
          source: data.utmSource,
          medium: data.utmMedium,
          campaign: data.utmCampaign,
          savedAt,
        });
        data.firstTouchSource = data.utmSource;
        data.firstTouchMedium = data.utmMedium;
        data.firstTouchCampaign = data.utmCampaign;
        data.firstTouchDate = new Date(savedAt).toISOString().slice(0, 10);
      }

      writeStore(window.sessionStorage, TRACKING_KEY, data);
      setTracking(data);
    } catch (err) {
      console.error("Tracking capture failed:", err);
      /* never let tracking break the form — fall back to a usable set */
      setTracking({
        ...EMPTY_TRACKING,
        leadPageUrl: href,
        landingPageUrl: href,
        utmSource: "direct",
        utmMedium: "none",
      });
    }
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

  /* ---------------------------------------------------------
     Sends the same payload to Zoho Bigin (Web to Record).
     Zoho does not send CORS headers, so a normal fetch() can
     never reach it from the browser. We instead build a real
     <form> in memory and POST it into a hidden iframe — the
     record is created in Bigin and the page never navigates.
     --------------------------------------------------------- */
  const sendToBigin = (payload: {
    source: string;
    name: string;
    company: string;
    phone: string;
    email: string;
    service: string;
    budget: string;
    timeline: string;
    message: string;
  }) =>
    new Promise<void>((resolve, reject) => {
      try {
        /* make sure the hidden iframe exists */
        let frame = document.getElementById(
          BIGIN_IFRAME_NAME
        ) as HTMLIFrameElement | null;

        if (!frame) {
          frame = document.createElement("iframe");
          frame.id = BIGIN_IFRAME_NAME;
          frame.name = BIGIN_IFRAME_NAME;
          frame.style.display = "none";
          frame.setAttribute("aria-hidden", "true");
          document.body.appendChild(frame);
        }

        /* normalise the phone number to E.164-ish with the India dial code */
        const rawPhone = payload.phone.trim();
        const phone = rawPhone.startsWith("+")
          ? rawPhone
          : `+91${rawPhone.replace(/^0+/, "").replace(/\s+/g, "")}`;

        /* build the Description that Bigin expects (mandatory field).
           Bigin only has four custom URL/UTM fields, so everything
           else that matters for attribution is written here. */
        const descriptionParts = [
          payload.message?.trim() || "No additional details provided.",
          `Selected service on website: ${payload.service}`,
          `Submitted from: Website enquiry form`,
          "",
          "--- Attribution ---",
          `Source / Medium: ${tracking.utmSource || "direct"} / ${tracking.utmMedium || "none"}`,
        ];
        if (tracking.utmCampaign) {
          descriptionParts.push(`Campaign: ${tracking.utmCampaign}`);
        }
        if (tracking.utmContent) {
          descriptionParts.push(`Ad content: ${tracking.utmContent}`);
        }
        if (tracking.utmTerm) {
          descriptionParts.push(`Keyword (utm_term): ${tracking.utmTerm}`);
        }
        if (tracking.gclid) {
          descriptionParts.push(`Google click ID: ${tracking.gclid}`);
        }
        if (tracking.fbclid) {
          descriptionParts.push(`Meta click ID: ${tracking.fbclid}`);
        }
        if (tracking.msclkid) {
          descriptionParts.push(`Microsoft click ID: ${tracking.msclkid}`);
        }
        if (tracking.referrer) {
          descriptionParts.push(`Referrer: ${tracking.referrer}`);
        }
        if (
          tracking.landingPageUrl &&
          tracking.landingPageUrl !== tracking.leadPageUrl
        ) {
          descriptionParts.push(`Landing page: ${tracking.landingPageUrl}`);
        }
        if (tracking.firstTouchSource) {
          const firstCampaign = tracking.firstTouchCampaign
            ? ` (${tracking.firstTouchCampaign})`
            : "";
          descriptionParts.push(
            `First touch: ${tracking.firstTouchSource} / ${tracking.firstTouchMedium || "none"}${firstCampaign} on ${tracking.firstTouchDate}`
          );
        }
        descriptionParts.push(`Submitted at: ${new Date().toLocaleString("en-IN")}`);

        const fields: Record<string, string> = {
          xnQsjsdp: BIGIN_XNQSJSDP,
          /* zc_gad is Zoho's Google Ads click field — feeding the
             gclid here lets Bigin tie the deal back to the ad */
          zc_gad: tracking.gclid,
          xmIwtLD: BIGIN_XMIWTLD,
          actionType: BIGIN_ACTION_TYPE,
          returnURL: "null",

          "Potential Name": payload.name,
          "Accounts.Account Name": payload.company?.trim() || payload.name,
          "Contacts.Mobile": phone,
          "Contacts.Email": payload.email,

          POTENTIALCF1: SERVICE_TO_BIGIN[payload.service] ?? "Video Production",
          POTENTIALCF3: payload.budget,
          POTENTIALCF2: payload.timeline,
          Description: descriptionParts.join("\n"),

          /* all four are 255-char fields in Bigin */
          POTENTIALCF4: clip(tracking.leadPageUrl),
          POTENTIALCF7: clip(tracking.utmCampaign),
          POTENTIALCF5: clip(tracking.utmSource),
          POTENTIALCF6: clip(tracking.utmContent),

          Pipeline: BIGIN_PIPELINE,
          Stage: BIGIN_STAGE,
          /* Google Ads / Meta Ads / WhatsApp / Official Website */
          "Lead Source": biginLeadSource(tracking),
        };

        if (debugBigin) {
          console.table(fields);
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = BIGIN_ACTION;
        form.target = BIGIN_IFRAME_NAME;
        form.acceptCharset = "UTF-8";
        form.style.display = "none";

        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value ?? "";
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        /* the iframe is cross-origin, so we can't read its load event
           reliably — give the POST a moment, then clean up. */
        window.setTimeout(() => {
          form.remove();
          resolve();
        }, 900);
      } catch (err) {
        reject(err);
      }
    });

  /* ---------------------------------------------------------
     NEW: navigate to the thank-you page. The name / service /
     source travel in the query string so the page can
     personalise itself and fire conversion events.
     --------------------------------------------------------- */
  const goToThankYou = (p: { name: string; service: string; source: string }) => {
    const q = new URLSearchParams({
      name: p.name,
      service: p.service,
      from: p.source,
    });
    router.push(`${THANK_YOU_PATH}?${q.toString()}`);
  };

  /* form submit — posts to Zoho Bigin (and Google Sheets if configured),
     then redirects to /thank-you */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      source: "banner",
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      service: String(formData.get("service") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      message: String(formData.get("message") ?? ""),
      submittedAt: new Date().toISOString(),
      leadSource: biginLeadSource(tracking),
      leadPageUrl: tracking.leadPageUrl,
      landingPageUrl: tracking.landingPageUrl,
      referrer: tracking.referrer,
      utmSource: tracking.utmSource,
      utmMedium: tracking.utmMedium,
      utmCampaign: tracking.utmCampaign,
      utmContent: tracking.utmContent,
      utmTerm: tracking.utmTerm,
      gclid: tracking.gclid,
      fbclid: tracking.fbclid,
      msclkid: tracking.msclkid,
      firstTouchSource: tracking.firstTouchSource,
      firstTouchMedium: tracking.firstTouchMedium,
      firstTouchCampaign: tracking.firstTouchCampaign,
      firstTouchDate: tracking.firstTouchDate,
    };

    /* Bigin is the system of record — Google Sheets is a best-effort
       backup and must never block or fail the submission. */
    const alsoSendToSheet = async () => {
      if (!SHEET_ENDPOINT) return;
      try {
        await sendToSheet(payload);
      } catch (err) {
        console.error("Sheet backup failed (CRM still received the lead):", err);
      }
    };

    setSubmitting(true);
    setSubmitError(false);
    try {
      await sendToBigin(payload);
      await alsoSendToSheet();
      if (debugBigin) {
        /* stay on the page so the iframe response can be read */
        setSubmitting(false);
        return;
      }
      goToThankYou(payload);
      /* keep the button in "Sending…" until the route changes */
    } catch (err) {
      console.error("Form submission failed:", err);
      setSubmitError(true);
      setSubmitting(false);
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
          <a href="#enquire" className="btn-ghost">
            Enquire Now
          </a>
        </div>
        <a href="#enquire" className="menu-toggle" aria-label="Go to enquiry form">
          <span></span><span></span><span></span>
        </a>
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

          {/* ENQUIRY FORM */}
          <form className="banner-form" id="enquire" onSubmit={handleSubmit}>
            <h3>Start Your Story</h3>
            <p className="sub">
              Tell us about your project — our studio will call you back within 24 hours.
            </p>

            <div className="field">
              <label htmlFor="b-name">Full Name</label>
              <input type="text" id="b-name" name="name" placeholder="Your name" required />
            </div>
            <div className="field">
              <label htmlFor="b-company">Company / Brand</label>
              <input type="text" id="b-company" name="company" placeholder="Your company name" required />
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
            <div className="field-row">
              <div className="field">
                <label htmlFor="b-budget">Monthly / Project Budget</label>
                <select id="b-budget" name="budget" defaultValue="" required>
                  <option value="" disabled>Select a budget</option>
                  {BUDGET_OPTIONS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="b-timeline">When do you want to start?</label>
                <select id="b-timeline" name="timeline" defaultValue="" required>
                  <option value="" disabled>Select a timeline</option>
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="b-message">Tell Us About Your Requirement</label>
              <textarea
                id="b-message"
                name="message"
                rows={3}
                placeholder="Tell us briefly about your project..."
              ></textarea>
            </div>
            <button type="submit" className="btn-solid" disabled={submitting}>
              {submitting ? "Sending…" : "Request a Call Back"}
            </button>
            {submitError && (
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
            <a href="#enquire" className="btn-solid">
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
      <a href="#enquire" className="float-btn">
        <span className="dot"></span> Enquire Now
      </a>

      {/* ===== TARGET FOR THE BIGIN POST (visible with ?biginDebug=1) ===== */}
      <iframe
        id={BIGIN_IFRAME_NAME}
        name={BIGIN_IFRAME_NAME}
        title="Bigin submission target"
        aria-hidden={!debugBigin}
        tabIndex={-1}
        style={
          debugBigin
            ? {
                display: "block",
                width: "100%",
                height: 420,
                border: "2px solid #e2231a",
                margin: "40px 0",
              }
            : { display: "none", width: 0, height: 0, border: 0 }
        }
      />
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
}
@media (prefers-reduced-motion: reduce){
  *{animation:none !important; transition:none !important;}
}
@media (hover:none){
  /* touch devices: no hover video trigger, just keep static row */
  .service-video, .service-scrim{display:none;}
}
`;