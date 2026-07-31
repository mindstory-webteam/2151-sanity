"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

type AnimationControls = ReturnType<typeof useAnimation>;
import type { ElementType, CSSProperties } from "react";
import Link from "next/link";

/* ════════════════════════════════════════════════════════
   TEXT ROLL — auto + hover (self-contained, no imports)
════════════════════════════════════════════════════════ */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const ROLL_STAGGER = 0.035;
function getRollDelay(i: number, total: number, dir: "left" | "right" | "center") {
  if (dir === "center") return ROLL_STAGGER * Math.abs(i - (total - 1) / 2);
  if (dir === "right")  return ROLL_STAGGER * (total - 1 - i);
  return ROLL_STAGGER * i;
}

const TextRollChar = ({ char, delay, duration, controls }: { char: string; delay: number; duration: number; controls: AnimationControls }) => {
  const ch = char === " " ? "\u00A0" : char;
  return (
    <span style={{ display:"inline-block", position:"relative", overflow:"hidden", lineHeight:0.88, verticalAlign:"top" }}>
      <motion.span style={{ display:"block" }} animate={controls} variants={{
        idle:    { y:"0%",    transition:{ ease:"easeInOut", duration:duration/1000, delay } },
        rolling: { y:"-100%", transition:{ ease:"easeInOut", duration:duration/1000, delay } },
        reset:   { y:"100%",  transition:{ duration:0 } },
      }}>{ch}</motion.span>
      <motion.span aria-hidden style={{ display:"block", position:"absolute", inset:0, whiteSpace:"pre" }} animate={controls} variants={{
        idle:    { y:"100%",  transition:{ ease:"easeInOut", duration:duration/1000, delay } },
        rolling: { y:"0%",    transition:{ ease:"easeInOut", duration:duration/1000, delay } },
        reset:   { y:"200%",  transition:{ duration:0 } },
      }}>{ch}</motion.span>
    </span>
  );
};

const TextRoll = ({ children, direction="left", autoRoll=false, autoRollInterval=2500, autoRollDuration=400 }:
  { children: string; direction?: "left"|"right"|"center"; autoRoll?: boolean; autoRollInterval?: number; autoRollDuration?: number }) => {
  const chars    = children.split("");
  const controls = useAnimation();
  const hovering = useRef(false);
  const rolling  = useRef(false);
  const doRoll   = useCallback(async () => {
    if (rolling.current) return;
    rolling.current = true;
    await controls.start("rolling");
    await controls.start("reset");
    await controls.start("idle");
    rolling.current = false;
  }, [controls]);
  useEffect(() => {
    if (!autoRoll) return;
    const id = setInterval(() => { if (!hovering.current) doRoll(); }, autoRollInterval);
    return () => clearInterval(id);
  }, [autoRoll, autoRollInterval, doRoll]);
  return (
    <span onMouseEnter={() => { hovering.current=true; doRoll(); }} onMouseLeave={() => { hovering.current=false; }}
      style={{ display:"inline-flex", cursor:"pointer", userSelect:"none", verticalAlign:"top" }}>
      {chars.map((ch, i) => <TextRollChar key={i} char={ch} controls={controls} delay={getRollDelay(i,chars.length,direction)} duration={autoRollDuration} />)}
    </span>
  );
};

/* ════════════════════════════════════════════════════════
   SPLIT TEXT
════════════════════════════════════════════════════════ */
type FromTo = { opacity?:number; y?:number; x?:number; scale?:number; rotation?:number; skewX?:number; [k:string]:number|undefined };
interface SplitTextProps {
  text:string; className?:string; delay?:number; duration?:number; ease?:string;
  splitType?:"chars"|"words"|"lines"; from?:FromTo; to?:FromTo;
  threshold?:number; rootMargin?:string; textAlign?:CSSProperties["textAlign"];
  onLetterAnimationComplete?:()=>void; showCallback?:boolean; tag?:ElementType;
  hoverRoll?:boolean; hoverRollDirection?:"left"|"right"|"center";
  autoRoll?:boolean; autoRollInterval?:number; autoRollDuration?:number;
}

function HoverRollSplitText({ text,className="",delay=50,duration=1.25,ease="power3.out",splitType="chars",
  from={opacity:0,y:40},to={opacity:1,y:0},threshold=0.1,rootMargin="-100px",textAlign="left",
  onLetterAnimationComplete,showCallback=false,hoverRollDirection="left",
  autoRoll=false,autoRollInterval=2500,autoRollDuration=400 }: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unitRefs     = useRef<(HTMLSpanElement|null)[]>([]);
  const tlRef        = useRef<gsap.core.Timeline|null>(null);
  const units = splitType==="chars" ? text.split("") : splitType==="words" ? text.split(" ") : text.split("\n");

  useEffect(() => {
    const container = containerRef.current;
    const targets   = unitRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!container || !targets.length) return;
    gsap.set(targets, { ...from });
    tlRef.current = gsap.timeline({ paused:true, onComplete:()=>{ if(showCallback&&onLetterAnimationComplete) onLetterAnimationComplete(); } });
    tlRef.current.to(targets, { ...to, duration, ease, stagger:delay/1000 });
    const io = new IntersectionObserver((entries) => entries.forEach(e => { if(e.isIntersecting){tlRef.current?.play();io.unobserve(container);} }), { threshold, rootMargin });
    io.observe(container);
    return () => { io.disconnect(); tlRef.current?.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <div ref={containerRef} className={className} aria-label={text}
      style={{ textAlign, lineHeight:"inherit", display:"flex", flexWrap:"wrap", gap:splitType==="chars"?"0":"0.2em" }}>
      {units.map((unit, i) => {
        if (unit===" " && splitType==="chars") return <span key={i} ref={el=>{unitRefs.current[i]=el;}} style={{display:"inline-block"}}>&nbsp;</span>;
        return (
          <span key={i} ref={el=>{unitRefs.current[i]=el;}} style={{display:"inline-block"}}>
            <TextRoll direction={hoverRollDirection} autoRoll={autoRoll} autoRollInterval={autoRollInterval+i*150} autoRollDuration={autoRollDuration}>{unit}</TextRoll>
          </span>
        );
      })}
    </div>
  );
}

function StandardSplitText({ text,className="",delay=50,duration=1.25,ease="power3.out",splitType="chars",
  from={opacity:0,y:40},to={opacity:1,y:0},threshold=0.1,rootMargin="-100px",textAlign="left",
  onLetterAnimationComplete,showCallback=false,tag:Tag="div" }: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline|null>(null);
  useEffect(() => {
    const container = containerRef.current; if (!container) return;
    const buildSpans = (): HTMLElement[] => {
      container.innerHTML = "";
      if (splitType==="chars") {
        const spans: HTMLElement[] = [];
        text.split(" ").forEach((word,wi,arr) => {
          const wordEl = document.createElement("span"); wordEl.style.display="inline-block"; wordEl.style.whiteSpace="nowrap";
          word.split("").forEach(char => { const el=document.createElement("span"); el.textContent=char; el.style.display="inline-block"; el.style.willChange="transform, opacity"; wordEl.appendChild(el); spans.push(el); });
          container.appendChild(wordEl);
          if (wi<arr.length-1) { const sp=document.createElement("span"); sp.innerHTML="&nbsp;"; sp.style.display="inline-block"; container.appendChild(sp); }
        });
        return spans;
      }
      if (splitType==="words") return text.split(" ").map((word,wi,arr) => { const el=document.createElement("span"); el.textContent=word+(wi<arr.length-1?"\u00A0":""); el.style.display="inline-block"; el.style.willChange="transform, opacity"; container.appendChild(el); return el; });
      return text.split("\n").map(line => { const el=document.createElement("span"); el.textContent=line; el.style.display="block"; el.style.willChange="transform, opacity"; container.appendChild(el); return el; });
    };
    const targets = buildSpans(); if (!targets.length) return;
    gsap.set(targets, { ...from });
    tlRef.current = gsap.timeline({ paused:true, onComplete:()=>{ if(showCallback&&onLetterAnimationComplete) onLetterAnimationComplete(); } });
    tlRef.current.to(targets, { ...to, duration, ease, stagger:delay/1000 });
    const io = new IntersectionObserver((entries) => entries.forEach(e => { if(e.isIntersecting){tlRef.current?.play();io.unobserve(container);} }), { threshold, rootMargin });
    io.observe(container);
    return () => { io.disconnect(); tlRef.current?.kill(); if(container) container.innerHTML=text; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);
  return <Tag ref={containerRef as React.Ref<never>} className={className} style={{ textAlign, lineHeight:"inherit" }} aria-label={text} />;
}

function SplitText(props: SplitTextProps) {
  if (props.hoverRoll) return <HoverRollSplitText {...props} />;
  return <StandardSplitText {...props} />;
}

/* ════════════════════════════════════════════════════════
   ROLL BUTTON
════════════════════════════════════════════════════════ */
const RB_STAGGER = 0.028;
const RBLabel = ({ children, hovered }: { children:string; hovered:boolean }) => {
  const chars = children.split("");
  return (
    <span style={{ position:"relative", display:"inline-block", overflow:"hidden", lineHeight:1, verticalAlign:"top" }}>
      <span aria-hidden style={{ display:"block" }}>
        {chars.map((l,i) => (
          <motion.span key={i} animate={hovered?{y:"-100%"}:{y:0}}
            transition={{ ease:"easeInOut", duration:0.36, delay:RB_STAGGER*i }}
            style={{ display:"inline-block" }}>{l===" "?"\u00A0":l}</motion.span>
        ))}
      </span>
      <span aria-hidden style={{ display:"block", position:"absolute", inset:0 }}>
        {chars.map((l,i) => (
          <motion.span key={i} animate={hovered?{y:0}:{y:"100%"}}
            transition={{ ease:"easeInOut", duration:0.36, delay:RB_STAGGER*i }}
            style={{ display:"inline-block" }}>{l===" "?"\u00A0":l}</motion.span>
        ))}
      </span>
    </span>
  );
};

const RollButton = ({ label, href, variant="filled", onClick }: { label:string; href?:string; variant?:"filled"|"outline"; onClick?:(e:React.MouseEvent)=>void }) => {
  const [hov, setHov] = React.useState(false);
  const isFilled = variant === "filled";
  const inner = (
    <motion.span
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      whileTap={{ scale:0.97 }}
      style={{
        display:"inline-flex", alignItems:"center", padding:"13px 28px",
        background: isFilled ? (hov?"#9e2118":"#c8372d") : "transparent",
        border: isFilled ? "none" : "1px solid rgba(200,55,45,0.5)",
        color: isFilled ? "#fff" : (hov?"#fff":"#c8372d"),
        fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600,
        letterSpacing:"0.26em", textTransform:"uppercase",
        cursor:"pointer", userSelect:"none", textDecoration:"none",
        transition:"background 0.3s ease, color 0.3s ease",
        boxShadow: isFilled ? "0 2px 16px rgba(200,55,45,0.32)" : "none",
      }}
    >
      <RBLabel hovered={hov}>{label}</RBLabel>
    </motion.span>
  );
  if (href) return <Link href={href} style={{ textDecoration:"none" }} onClick={onClick}>{inner}</Link>;
  return <button type="button" style={{ background:"none", border:"none", padding:0, cursor:"pointer" }} onClick={onClick}>{inner}</button>;
};

/* ════════════════════════════════════════════════════════
   JOBS DATA
════════════════════════════════════════════════════════ */
import React from "react";

const JOBS = [
  {
    id:"01", title:"Senior Cinematographer", dept:"Production", type:"Full-time", loc:"Mumbai, India",
    desc:"Lead visual storytelling for luxury brand films and editorial campaigns. You'll work alongside directors to craft cinematic language that elevates every frame.",
    tags:["Cinematography","Color Grading","Arri Alexa","Lighting"],
  },
  {
    id:"02", title:"AI Content Strategist", dept:"AI Production", type:"Full-time", loc:"Remote",
    desc:"Bridge AI tools with creative storytelling. Drive our AI-powered production pipeline from concept to delivery across multiple formats.",
    tags:["Generative AI","Prompt Engineering","Video Production","Strategy"],
  },
  {
    id:"03", title:"Brand Film Director", dept:"Creative", type:"Contract", loc:"Mumbai / Delhi",
    desc:"Direct high-impact brand films for global clients. Bring scripts to life through visual imagination, precision directing, and a deep sense of narrative.",
    tags:["Direction","Brand Films","Pre-production","Post-production"],
  },
  {
    id:"04", title:"Motion Designer", dept:"Post Production", type:"Full-time", loc:"Mumbai, India",
    desc:"Create stunning motion graphics, title sequences, and animated brand assets. Your work will live in films, events, and campaigns worldwide.",
    tags:["After Effects","Cinema 4D","Motion Graphics","Typography"],
  },
  {
    id:"05", title:"Production Coordinator", dept:"Operations", type:"Full-time", loc:"Mumbai, India",
    desc:"Keep complex shoots moving seamlessly. Coordinate talent, locations, crew, and logistics for productions ranging from corporate films to large-scale events.",
    tags:["Coordination","Scheduling","Budgeting","Communication"],
  },
];

const PERKS = [
  { icon:"✦", title:"Creative Freedom", desc:"Work on projects that matter with full creative input on every production." },
  { icon:"◈", title:"Global Clients", desc:"Collaborate with luxury brands, tech giants, and cultural institutions worldwide." },
  { icon:"◉", title:"AI-First Studio", desc:"Access cutting-edge AI tools integrated into our production pipeline." },
  { icon:"◇", title:"Growth Path", desc:"Clear progression, mentorship, and opportunities to lead your own projects." },
];

/* ════════════════════════════════════════════════════════
   EMAILJS CONFIG
════════════════════════════════════════════════════════ */
const EJS_SERVICE_ID  = "service_zwdympt";
const EJS_TEMPLATE_ID = "template_vikbi0a";
const EJS_PUBLIC_KEY  = "3YkH5VjLx7c2I0N3y";

/* ════════════════════════════════════════════════════════
   CAREERS SECTION
════════════════════════════════════════════════════════ */
export default function Careers() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [openJob, setOpenJob] = React.useState<string|null>(null);
  const [applyJob, setApplyJob] = React.useState<typeof JOBS[0]|null>(null);
  const [cvFile,   setCvFile]   = React.useState<File|null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [sending,  setSending]  = React.useState(false);
  const [submitted,setSubmitted]= React.useState(false);
  const [form, setForm] = React.useState({ name:"", email:"", phone:"", portfolio:"", cover:"" });

  const openModal  = (job: typeof JOBS[0]) => { setApplyJob(job); setSubmitted(false); setSending(false); setCvFile(null); setEmailError(""); setForm({ name:"",email:"",phone:"",portfolio:"",cover:"" }); };
  const closeModal = () => { setApplyJob(null); setSubmitted(false); };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setCvFile(e.target.files[0]);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setCvFile(f);
  };

  const [emailError, setEmailError] = React.useState("");

  /* ── UPDATED handleSubmit with timeout + 0x0.st upload ── */
 const handleSubmit = async () => {
    if (!form.name || !form.email || !cvFile || !applyJob) return;
    setEmailError("");
    setSending(true);

    try {
      // ── Step 1: Upload CV to Cloudinary ──
      const CLOUDINARY_CLOUD_NAME = "dzcpj4zcs"; // ← paste your cloud name here
      const CLOUDINARY_UPLOAD_PRESET = "21fiftyone";         // ← your preset

      let cvUrl = `${cvFile.name} (${(cvFile.size / 1024 / 1024).toFixed(2)} MB) — upload failed, applicant will send separately`;

      try {
        const cloudData = new FormData();
        cloudData.append("file", cvFile);
        cloudData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
          { method: "POST", body: cloudData, signal: controller.signal }
        );
        clearTimeout(timeoutId);

        const uploadJson = await uploadRes.json();
        if (uploadJson.secure_url) {
          cvUrl = `${cvFile.name} (${(cvFile.size / 1024 / 1024).toFixed(2)} MB)\nDownload: ${uploadJson.secure_url}`;
        }
      } catch {
        // Upload failed — email still sends without link
      }

      // ── Step 2: Send email via EmailJS ──
      const emailjs = (await import("@emailjs/browser")).default;

      const result = await emailjs.send(
        EJS_SERVICE_ID,
        EJS_TEMPLATE_ID,
        {
          name: form.name,
          message: [
            `Position Applied: ${applyJob.title}`,
            `Department: ${applyJob.dept}`,
            `Type: ${applyJob.type}`,
            `Location: ${applyJob.loc}`,
            ``,
            `Email: ${form.email}`,
            form.phone     ? `Phone: ${form.phone}`         : "",
            form.portfolio ? `Portfolio: ${form.portfolio}` : "",
            `CV: ${cvUrl}`,
            form.cover     ? `\nCover Note:\n${form.cover}` : "",
          ].filter(Boolean).join("\n"),
          time: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        EJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setSubmitted(true);
      } else {
        throw new Error("Unexpected response from EmailJS");
      }
    } catch (err: any) {
      const msg =
        typeof err?.text    === "string" ? err.text    :
        typeof err?.message === "string" ? err.message :
        "Failed to send. Please try again.";
      setEmailError(msg);
    } finally {
      setSending(false);
    }
  };

  /* scroll reveal */
  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ (e.target as HTMLElement).classList.add("revealed"); io.unobserve(e.target); } });
    }, { threshold:0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --cream: #f2ede6;
          --black: #0c0c0c;
          --red:   #c8372d;
          --muted: #8a8480;
          --line:  rgba(12,12,12,0.12);
          --card:  #f7f3ee;
        }

        .cr-section {
          width:100%; background:var(--cream);
          padding:120px 0 140px; overflow:hidden;
          position:relative; box-sizing:border-box;
        }
        .cr-section::before {
          content:''; position:absolute; top:0; left:64px; right:64px;
          height:1px; background:var(--line);
        }
        .cr-inner {
          max-width:1280px; margin:0 auto;
          padding:0 64px; box-sizing:border-box;
        }

        /* ── label row ── */
        .cr-label-row {
          display:flex; justify-content:space-between; align-items:center;
          margin-bottom:56px; flex-wrap:wrap; gap:8px;
        }
        .cr-label {
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.3em; text-transform:uppercase; color:var(--red);
        }
        .cr-label-r {
          font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing:0.18em; text-transform:uppercase; color:var(--muted);
        }

        /* ── hero grid ── */
        .cr-hero {
          display:grid; grid-template-columns:1fr 500px;
          gap:0; align-items:end; margin-bottom:96px;
        }

        /* ── headlines ── */
        .cr-headline {
          font-family:'Anton',sans-serif !important;
          font-size:clamp(56px,12vw,168px) !important;
          line-height:0.88 !important; letter-spacing:-0.02em !important;
          color:var(--black) !important; text-transform:uppercase;
          padding-bottom:10px; display:block; overflow:visible;
        }
        .cr-headline-accent {
          font-family:'Playfair Display',serif !important;
          font-style:italic !important;
          font-size:clamp(40px,8.5vw,120px) !important;
          color:var(--red) !important; line-height:1 !important;
          letter-spacing:-0.01em !important; display:block;
          margin-top:8px; overflow:visible;
        }

        /* ── intro dark card ── */
        .cr-intro-card {
          background:var(--black); padding:48px 44px 44px;
          position:relative; align-self:end;
          margin-left:64px; box-sizing:border-box;
        }
        .cr-intro-card::before {
          content:''; position:absolute; top:0; left:0;
          width:3px; height:48px; background:var(--red);
        }
        .cr-intro-card p {
          font-family:'DM Sans',sans-serif; font-size:15px;
          line-height:1.8; color:#b0a99e; margin-bottom:28px; font-weight:300;
        }
        .cr-stat-row {
          display:flex; gap:48px; padding-top:28px;
          border-top:1px solid rgba(255,255,255,0.08); flex-wrap:wrap;
        }
        .cr-stat-num {
          font-family:'Anton',sans-serif; font-size:44px;
          line-height:1; color:#fff; display:block;
        }
        .cr-stat-lbl {
          font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing:0.2em; text-transform:uppercase;
          color:#666; margin-top:6px; display:block;
        }

        /* ── perks grid ── */
        .cr-perks {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:2px; margin-bottom:80px;
        }
        .cr-perk {
          background:var(--card); padding:32px 28px;
          border:1px solid var(--line); position:relative;
          transition:background 0.25s, transform 0.3s;
          cursor:default;
        }
        .cr-perk:hover { background:#ece7df; transform:translateY(-4px); }
        .cr-perk-icon {
          font-size:18px; color:var(--red); display:block; margin-bottom:16px;
        }
        .cr-perk-title {
          font-family:'Anton',sans-serif; font-size:18px;
          letter-spacing:0.04em; text-transform:uppercase;
          color:var(--black); margin-bottom:10px;
          transition:color 0.2s;
        }
        .cr-perk:hover .cr-perk-title { color:var(--red); }
        .cr-perk-desc {
          font-family:'DM Sans',sans-serif; font-size:13px;
          line-height:1.7; color:var(--muted); font-weight:300;
        }

        /* ── jobs ── */
        .cr-jobs-header {
          display:flex; justify-content:space-between; align-items:center;
          padding-bottom:20px; border-bottom:1px solid var(--line);
          margin-bottom:4px;
        }
        .cr-jobs-title {
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:500;
          letter-spacing:0.3em; text-transform:uppercase; color:var(--red);
        }
        .cr-jobs-count {
          font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing:0.18em; text-transform:uppercase; color:var(--muted);
        }

        .cr-job {
          border-bottom:1px solid var(--line);
          transition:background 0.2s;
          cursor:pointer;
        }
        .cr-job-head {
          display:grid; grid-template-columns:64px 1fr auto auto 120px;
          align-items:center; gap:24px; padding:28px 0;
        }
        .cr-job-num {
          font-family:'Playfair Display',serif; font-style:italic;
          font-size:13px; color:var(--red); letter-spacing:0.08em;
        }
        .cr-job-name {
          font-family:'Anton',sans-serif; font-size:clamp(18px,2.2vw,26px);
          letter-spacing:0.02em; text-transform:uppercase;
          color:var(--black); transition:color 0.2s;
        }
        .cr-job:hover .cr-job-name { color:var(--red); }
        .cr-job-dept {
          font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing:0.22em; text-transform:uppercase; color:var(--muted);
          padding:6px 14px; border:1px solid var(--line);
        }
        .cr-job-type {
          font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing:0.22em; text-transform:uppercase;
          color:var(--red); padding:6px 14px;
          border:1px solid rgba(200,55,45,0.25);
        }
        .cr-job-loc {
          font-family:'DM Sans',sans-serif; font-size:11px;
          letter-spacing:0.14em; color:var(--muted); text-align:right;
        }
        .cr-job-arrow {
          font-size:20px; color:var(--muted); transition:transform 0.3s ease, color 0.2s;
          display:inline-block;
        }
        .cr-job:hover .cr-job-arrow { color:var(--red); transform:rotate(45deg); }
        .cr-job.open .cr-job-arrow { transform:rotate(45deg); color:var(--red); }

        .cr-job-body {
          overflow:hidden; max-height:0;
          transition:max-height 0.45s cubic-bezier(0.16,1,0.3,1), padding 0.3s ease;
          padding:0 0 0 88px;
        }
        .cr-job-body.open {
          max-height:400px; padding:0 0 32px 88px;
        }
        .cr-job-desc {
          font-family:'DM Sans',sans-serif; font-size:14px;
          line-height:1.8; color:#3a3735; font-weight:300;
          max-width:600px; margin-bottom:20px;
        }
        .cr-job-tags { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px; }
        .cr-job-tag {
          font-family:'DM Sans',sans-serif; font-size:9px;
          letter-spacing:0.2em; text-transform:uppercase;
          color:var(--black); padding:6px 12px;
          border:1px solid rgba(12,12,12,0.15);
        }

        /* ── bottom strip ── */
        .cr-bottom {
          display:grid; grid-template-columns:1fr 1fr;
          gap:2px; margin-top:80px; border-top:1px solid var(--line); padding-top:64px;
        }
        .cr-bottom-left {
          background:var(--black); padding:56px 48px;
          display:flex; flex-direction:column; justify-content:space-between;
          gap:40px; position:relative;
        }
        .cr-bottom-left::before {
          content:''; position:absolute; top:0; left:0;
          width:3px; height:48px; background:var(--red);
        }
        .cr-bottom-title {
          font-family:'Anton',sans-serif; font-size:clamp(28px,3vw,42px);
          letter-spacing:0.02em; text-transform:uppercase;
          color:var(--cream); line-height:1; max-width:320px;
        }
        .cr-bottom-title span { color:var(--red); font-family:'Playfair Display',serif; font-style:italic; font-weight:400; }
        .cr-bottom-sub {
          font-family:'DM Sans',sans-serif; font-size:13px;
          line-height:1.8; color:#b0a99e; font-weight:300; max-width:340px;
        }
        .cr-bottom-right {
          background:var(--card); padding:56px 48px;
          display:flex; flex-direction:column; gap:28px;
        }
        .cr-form-label {
          font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.26em;
          text-transform:uppercase; color:var(--muted);
          padding:10px 0 0; display:block; margin-bottom:-2px;
        }
        .cr-form-input, .cr-form-select {
          font-family:'DM Sans',sans-serif; font-size:14px; color:var(--black);
          background:transparent; border:none; border-bottom:1px solid var(--line);
          padding:10px 0 12px; outline:none; width:100%;
          transition:border-color 0.2s; -webkit-appearance:none;
        }
        .cr-form-input::placeholder { color:rgba(12,12,12,0.28); }
        .cr-form-input:focus, .cr-form-select:focus { border-color:var(--red); }
        .cr-form-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }

        /* ── scroll reveal ── */
        [data-reveal] {
          opacity:0; transform:translateY(28px);
          transition:opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity:1; transform:translateY(0); }
        [data-reveal][data-d="1"] { transition-delay:0.08s; }
        [data-reveal][data-d="2"] { transition-delay:0.18s; }
        [data-reveal][data-d="3"] { transition-delay:0.3s; }
        [data-reveal][data-d="4"] { transition-delay:0.44s; }
        [data-reveal][data-d="5"] { transition-delay:0.58s; }

        /* ── responsive ── */
        @media (max-width:1024px) {
          .cr-hero { grid-template-columns:1fr; margin-bottom:56px; }
          .cr-intro-card { margin-left:0; margin-top:40px; }
          .cr-perks { grid-template-columns:repeat(2,1fr); }
          .cr-bottom { grid-template-columns:1fr; }
          .cr-job-head { grid-template-columns:48px 1fr auto; gap:16px; }
          .cr-job-dept, .cr-job-type { display:none; }
        }
        @media (max-width:768px) {
          .cr-section { padding:64px 0 80px; }
          .cr-inner { padding:0 28px; }
          .cr-section::before { left:28px; right:28px; }
          .cr-hero { margin-bottom:40px; }
          .cr-perks { grid-template-columns:1fr; }
          .cr-job-head { grid-template-columns:40px 1fr auto; }
          .cr-job-body.open { padding:0 0 24px 52px; }
          .cr-form-row { grid-template-columns:1fr; }
          .cr-bottom-left, .cr-bottom-right { padding:40px 28px; }
          .cr-stat-row { gap:24px; }
        }
        @media (max-width:480px) {
          .cr-inner { padding:0 20px; }
          .cr-section::before { left:20px; right:20px; }
          .cr-job-head { grid-template-columns:36px 1fr auto; gap:12px; }
          .cr-intro-card { padding:28px 24px 24px; }
          .cr-stat-num { font-size:32px; }
        }

        /* ── Apply Modal ── */
        .cr-modal-backdrop {
          position:fixed; inset:0; z-index:9000;
          background:rgba(8,8,8,0.72);
          backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:24px;
        }
        .cr-modal {
          background:var(--black); width:100%; max-width:680px;
          max-height:90vh; overflow-y:auto;
          position:relative;
          box-shadow:0 32px 96px rgba(0,0,0,0.7);
        }
        .cr-modal::-webkit-scrollbar { width:3px; }
        .cr-modal::-webkit-scrollbar-track { background:transparent; }
        .cr-modal::-webkit-scrollbar-thumb { background:rgba(200,55,45,0.4); border-radius:2px; }
        .cr-modal::before {
          content:''; position:absolute; top:0; left:0;
          width:100%; height:3px; background:var(--red);
        }
        .cr-modal-head {
          padding:40px 44px 28px;
          border-bottom:1px solid rgba(255,255,255,0.07);
          display:flex; justify-content:space-between; align-items:flex-start;
        }
        .cr-modal-eyebrow {
          font-family:'DM Sans',sans-serif; font-size:9px; font-weight:500;
          letter-spacing:0.32em; text-transform:uppercase; color:var(--red);
          display:block; margin-bottom:8px;
        }
        .cr-modal-title {
          font-family:'Anton',sans-serif; font-size:clamp(22px,3vw,32px);
          letter-spacing:0.02em; text-transform:uppercase;
          color:#fff; line-height:1;
        }
        .cr-modal-close {
          background:rgba(255,255,255,0.06); border:none;
          width:36px; height:36px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:rgba(255,255,255,0.5);
          font-size:18px; transition:background 0.2s, color 0.2s;
          margin-top:4px;
        }
        .cr-modal-close:hover { background:var(--red); color:#fff; }
        .cr-modal-body { padding:36px 44px 44px; display:flex; flex-direction:column; gap:20px; }

        .cr-mfield { display:flex; flex-direction:column; gap:0; }
        .cr-mlabel {
          font-family:'DM Sans',sans-serif; font-size:9px; letter-spacing:0.26em;
          text-transform:uppercase; color:rgba(255,255,255,0.3);
          padding:10px 16px 0;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06); border-bottom:none;
        }
        .cr-minput, .cr-mselect, .cr-mtextarea {
          font-family:'DM Sans',sans-serif; font-size:14px; color:#fff;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.06); border-top:none;
          padding:10px 16px 14px; outline:none; width:100%;
          transition:background 0.2s, border-color 0.2s; -webkit-appearance:none;
        }
        .cr-minput::placeholder, .cr-mtextarea::placeholder { color:rgba(255,255,255,0.2); }
        .cr-minput:focus, .cr-mselect:focus, .cr-mtextarea:focus {
          background:rgba(200,55,45,0.06); border-color:rgba(200,55,45,0.4);
        }
        .cr-mselect { cursor:pointer; color:rgba(255,255,255,0.6); }
        .cr-mselect option { background:#0c0c0c; color:#fff; }
        .cr-mtextarea { resize:none; height:100px; }
        .cr-mrow { display:grid; grid-template-columns:1fr 1fr; gap:3px; }

        .cr-upload-zone {
          border:1.5px dashed rgba(200,55,45,0.35);
          padding:32px 24px;
          display:flex; flex-direction:column; align-items:center;
          gap:12px; cursor:pointer; position:relative;
          transition:border-color 0.2s, background 0.2s;
          background:rgba(255,255,255,0.02);
        }
        .cr-upload-zone:hover, .cr-upload-zone.drag { border-color:var(--red); background:rgba(200,55,45,0.05); }
        .cr-upload-zone input[type="file"] {
          position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%;
        }
        .cr-upload-icon {
          width:44px; height:44px; border:1px solid rgba(200,55,45,0.4);
          display:flex; align-items:center; justify-content:center;
          color:var(--red); font-size:20px;
        }
        .cr-upload-text {
          font-family:'DM Sans',sans-serif; font-size:13px;
          color:rgba(255,255,255,0.5); text-align:center; line-height:1.6;
        }
        .cr-upload-text strong { color:#fff; display:block; margin-bottom:4px; }
        .cr-upload-hint {
          font-family:'DM Sans',sans-serif; font-size:9px;
          letter-spacing:0.18em; text-transform:uppercase;
          color:rgba(255,255,255,0.22);
        }
        .cr-upload-file {
          display:flex; align-items:center; gap:12px;
          padding:12px 16px; background:rgba(200,55,45,0.08);
          border:1px solid rgba(200,55,45,0.25); width:100%;
        }
        .cr-upload-file-name {
          font-family:'DM Sans',sans-serif; font-size:12px;
          color:rgba(255,255,255,0.7); flex:1; overflow:hidden;
          text-overflow:ellipsis; white-space:nowrap;
        }
        .cr-upload-file-remove {
          background:none; border:none; color:rgba(255,255,255,0.35);
          cursor:pointer; font-size:16px; padding:0; line-height:1;
          transition:color 0.2s;
        }
        .cr-upload-file-remove:hover { color:var(--red); }

        .cr-modal-footer {
          display:flex; align-items:center; justify-content:space-between;
          gap:16px; padding-top:20px;
          border-top:1px solid rgba(255,255,255,0.06);
        }
        .cr-modal-note {
          font-family:'DM Sans',sans-serif; font-size:10px;
          letter-spacing:0.12em; color:rgba(255,255,255,0.2); line-height:1.6;
        }
        .cr-modal-submit {
          display:flex; align-items:center; gap:10px;
          padding:14px 28px; background:var(--red);
          border:none; color:#fff;
          font-family:'DM Sans',sans-serif; font-size:10px; font-weight:600;
          letter-spacing:0.28em; text-transform:uppercase;
          cursor:pointer; white-space:nowrap; flex-shrink:0;
          transition:background 0.2s, transform 0.15s;
        }
        .cr-modal-submit:hover:not(:disabled) { background:#a82d24; transform:translateY(-1px); }
        .cr-modal-submit:disabled { opacity:0.5; cursor:not-allowed; }

        .cr-modal-success {
          display:flex; flex-direction:column; align-items:center;
          gap:16px; padding:56px 44px; text-align:center;
        }
        .cr-modal-success-icon {
          width:56px; height:56px; border:2px solid var(--red);
          display:flex; align-items:center; justify-content:center;
          color:var(--red); font-size:24px;
        }
        .cr-modal-success-h {
          font-family:'Anton',sans-serif; font-size:24px;
          letter-spacing:0.06em; text-transform:uppercase; color:#fff;
        }
        .cr-modal-success-p {
          font-family:'DM Sans',sans-serif; font-size:13px;
          color:rgba(255,255,255,0.4); line-height:1.7;
        }

        @media (max-width:600px) {
          .cr-modal-head, .cr-modal-body { padding-left:24px; padding-right:24px; }
          .cr-mrow { grid-template-columns:1fr; }
          .cr-modal-footer { flex-direction:column; align-items:flex-start; }
        }
      `}</style>

      <section className="cr-section" ref={sectionRef}>
        <div className="cr-inner">

          {/* ── Label row ── */}
          <div className="cr-label-row" data-reveal>
            <span className="cr-label">Careers at 21FiftyOne</span>
            <span className="cr-label-r">Join the Studio — 2025</span>
          </div>

          {/* ── Hero: headlines + dark card ── */}
          <div className="cr-hero">
            <div>
              <SplitText
                text="JOIN THE"
                tag="div"
                className="cr-headline"
                delay={45} duration={1.25} ease="power3.out"
                splitType="chars"
                from={{ opacity:0, y:60 }} to={{ opacity:1, y:0 }}
                threshold={0.1} rootMargin="-60px"
                textAlign="left"
                hoverRoll hoverRollDirection="center"
                autoRoll autoRollInterval={5000} autoRollDuration={580}
              />
              <SplitText
                text="Vision."
                tag="div"
                className="cr-headline-accent"
                delay={35} duration={1.4} ease="power4.out"
                splitType="words"
                from={{ opacity:0, y:80, skewX:8 }} to={{ opacity:1, y:0, skewX:0 }}
                threshold={0.1} rootMargin="-60px"
                textAlign="left"
                hoverRoll hoverRollDirection="left"
                autoRoll autoRollInterval={5600} autoRollDuration={580}
              />
            </div>

            <div className="cr-intro-card" data-reveal data-d="2">
              <p>
                We're building a team of visionaries, technologists, and storytellers who believe that every frame is an opportunity to leave a mark.
                If you create with intention and execute with obsession, you belong here.
              </p>
              <div className="cr-stat-row">
                <div><span className="cr-stat-num">15+</span><span className="cr-stat-lbl">Open Roles</span></div>
                <div><span className="cr-stat-num">3</span><span className="cr-stat-lbl">Cities</span></div>
                <div><span className="cr-stat-num">100%</span><span className="cr-stat-lbl">Creative</span></div>
              </div>
            </div>
          </div>

          {/* ── Perks grid ── */}
          <div className="cr-perks" data-reveal data-d="2">
            {PERKS.map((perk, i) => (
              <div key={i} className="cr-perk">
                <span className="cr-perk-icon">{perk.icon}</span>
                <h3 className="cr-perk-title">{perk.title}</h3>
                <p className="cr-perk-desc">{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* ── Jobs list ── */}
          <div data-reveal data-d="3">
            <div className="cr-jobs-header">
              <span className="cr-jobs-title">Open Positions</span>
              <span className="cr-jobs-count">{JOBS.length} Roles Available</span>
            </div>

            {JOBS.map((job) => (
              <div key={job.id} className={`cr-job${openJob===job.id?" open":""}`}
                onClick={() => setOpenJob(openJob===job.id ? null : job.id)}>
                <div className="cr-job-head">
                  <span className="cr-job-num">{job.id} /</span>
                  <span className="cr-job-name">{job.title}</span>
                  <span className="cr-job-dept">{job.dept}</span>
                  <span className="cr-job-type">{job.type}</span>
                  <span className="cr-job-loc">{job.loc}</span>
                  <span className="cr-job-arrow">↗</span>
                </div>
                <div className={`cr-job-body${openJob===job.id?" open":""}`}>
                  <p className="cr-job-desc">{job.desc}</p>
                  <div className="cr-job-tags">
                    {job.tags.map(t => <span key={t} className="cr-job-tag">{t}</span>)}
                  </div>
                  <RollButton label="Apply Now" onClick={(e) => { e.stopPropagation(); openModal(job); }} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Bottom: CTA + form ── */}
          <div className="cr-bottom" data-reveal data-d="4">

            {/* Left dark CTA */}
            <div className="cr-bottom-left">
              <div>
                <h3 className="cr-bottom-title">
                  Don't See Your<br />
                  <span>Perfect Role?</span>
                </h3>
                <p className="cr-bottom-sub" style={{ marginTop:20 }}>
                  We're always looking for exceptional talent. Send us your portfolio and tell us how you'd add to the story.
                </p>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <RollButton label="Send Portfolio" href="/contact" />
                <RollButton label="View Our Work" href="/work" variant="outline" />
              </div>
            </div>

            {/* Right form */}
            <div className="cr-bottom-right">
              <div>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:500, letterSpacing:"0.3em", textTransform:"uppercase", color:"var(--red)", marginBottom:8 }}>
                  Quick Application
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.7, color:"var(--muted)", fontWeight:300 }}>
                  Drop your details and we'll reach out about roles that match your profile.
                </p>
              </div>

              <div className="cr-form-row">
                <div>
                  <label className="cr-form-label">Full Name</label>
                  <input className="cr-form-input" type="text" placeholder="John Smith" />
                </div>
                <div>
                  <label className="cr-form-label">Email</label>
                  <input className="cr-form-input" type="email" placeholder="john@studio.com" />
                </div>
              </div>

              <div>
                <label className="cr-form-label">Role You're Interested In</label>
                <select className="cr-form-select">
                  <option value="">Select a role</option>
                  {JOBS.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                  <option value="other">Open Application</option>
                </select>
              </div>

              <div>
                <label className="cr-form-label">Portfolio / LinkedIn URL</label>
                <input className="cr-form-input" type="url" placeholder="https://your-portfolio.com" />
              </div>

              <div style={{ paddingTop:8 }}>
                <RollButton label="Submit Application" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══ APPLY MODAL ══ */}
      {applyJob && (
        <motion.div
          className="cr-modal-backdrop"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.25 }}
          onClick={closeModal}
        >
          <motion.div
            className="cr-modal"
            initial={{ opacity:0, y:40, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:24, scale:0.97 }}
            transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
            onClick={e => e.stopPropagation()}
          >
            {submitted ? (
              <div className="cr-modal-success">
                <div className="cr-modal-success-icon">✓</div>
                <p className="cr-modal-success-h">Application Received</p>
                <p className="cr-modal-success-p">
                  Thank you for applying to <strong style={{color:"#fff"}}>{applyJob.title}</strong>.<br/>
                  Our team will review your application and get back to you within 3–5 business days.
                </p>
                <div style={{marginTop:8}}>
                  <RollButton label="Close" onClick={closeModal} variant="outline" />
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="cr-modal-head">
                  <div>
                    <span className="cr-modal-eyebrow">Apply for Position</span>
                    <h2 className="cr-modal-title">{applyJob.title}</h2>
                    <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",padding:"5px 12px",border:"1px solid rgba(255,255,255,0.1)"}}>{applyJob.dept}</span>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"var(--red)",padding:"5px 12px",border:"1px solid rgba(200,55,45,0.25)"}}>{applyJob.type}</span>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,letterSpacing:"0.18em",color:"rgba(255,255,255,0.3)"}}>{applyJob.loc}</span>
                    </div>
                  </div>
                  <button className="cr-modal-close" onClick={closeModal} aria-label="Close">✕</button>
                </div>

                {/* Body */}
                <div className="cr-modal-body">

                  {/* Name + Email */}
                  <div className="cr-mrow">
                    <div className="cr-mfield">
                      <label className="cr-mlabel">Full Name *</label>
                      <input className="cr-minput" name="name" type="text" placeholder="John Smith" value={form.name} onChange={handleFormChange} autoComplete="off" />
                    </div>
                    <div className="cr-mfield">
                      <label className="cr-mlabel">Email Address *</label>
                      <input className="cr-minput" name="email" type="email" placeholder="john@studio.com" value={form.email} onChange={handleFormChange} autoComplete="off" />
                    </div>
                  </div>

                  {/* Phone + Portfolio */}
                  <div className="cr-mrow">
                    <div className="cr-mfield">
                      <label className="cr-mlabel">Phone Number</label>
                      <input className="cr-minput" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleFormChange} autoComplete="off" />
                    </div>
                    <div className="cr-mfield">
                      <label className="cr-mlabel">Portfolio / LinkedIn</label>
                      <input className="cr-minput" name="portfolio" type="url" placeholder="https://your-portfolio.com" value={form.portfolio} onChange={handleFormChange} autoComplete="off" />
                    </div>
                  </div>

                  {/* CV Upload */}
                  <div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,letterSpacing:"0.26em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:8}}>
                      Upload CV / Resume *
                    </p>
                    {cvFile ? (
                      <div className="cr-upload-file">
                        <span style={{fontSize:18,color:"var(--red)"}}>📄</span>
                        <span className="cr-upload-file-name">{cvFile.name}</span>
                        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"rgba(255,255,255,0.3)"}}>
                          {(cvFile.size/1024/1024).toFixed(1)} MB
                        </span>
                        <button className="cr-upload-file-remove" onClick={() => setCvFile(null)}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={`cr-upload-zone${dragging?" drag":""}`}
                        onDragOver={e=>{e.preventDefault();setDragging(true);}}
                        onDragLeave={()=>setDragging(false)}
                        onDrop={handleDrop}
                      >
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        <div className="cr-upload-icon">↑</div>
                        <div className="cr-upload-text">
                          <strong>Drag & drop your CV here</strong>
                          or click to browse files
                        </div>
                        <span className="cr-upload-hint">PDF, DOC, DOCX — Max 10 MB</span>
                      </div>
                    )}
                  </div>

                  {/* Cover note */}
                  <div className="cr-mfield">
                    <label className="cr-mlabel">Cover Note</label>
                    <textarea className="cr-mtextarea" name="cover" placeholder="Tell us briefly why you're the right fit for this role..." value={form.cover} onChange={handleFormChange} />
                  </div>

                  {/* Footer */}
                  <div className="cr-modal-footer">
                    <p className="cr-modal-note">
                      We respond within 3–5 days.<br/>Your data is kept confidential.
                    </p>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
                      {emailError && (
                        <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:"0.12em",color:"#ff6b6b",background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",padding:"8px 14px",maxWidth:280,textAlign:"right"}}>
                          {emailError}
                        </p>
                      )}
                      <button
                        className="cr-modal-submit"
                        onClick={handleSubmit}
                        disabled={sending || !form.name || !form.email || !cvFile}
                      >
                        {sending ? "Sending…" : "Submit Application →"}
                      </button>
                    </div>
                  </div>

                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}