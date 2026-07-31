"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

/* ═══════════════════════════════════════════════════════════
   BUG SVG — bigger (38px)
═══════════════════════════════════════════════════════════ */
const BugIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256.28 244.89"
    width="68"
    height="68"
    aria-hidden
  >
    <path d="M115.49,155.76c-16.27-1.68-29.01-16.13-29.06-33.74-.06-17.62,12.59-32.14,28.84-33.93.6-.06,1.13.11,1.58.51.45.4.68.92.68,1.52l.13,39.47c0,1.28,2.05,1.27,2.04,0l-.13-39.47c0-.6.23-1.12.67-1.52.45-.4.98-.58,1.58-.52,16.27,1.68,29.01,16.13,29.06,33.74.06,17.62-12.59,32.14-28.84,33.93" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M120.62,133.05c-3.28-1.05-6.78.75-7.84,4.03-1.05,3.27.75,6.78,4.03,7.84,3.28,1.05,6.78-.75,7.84-4.03,1.05-3.28-.75-6.78-4.03-7.84h0Z" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M140.93,129.07c-1.05,3.27-4.56,5.08-7.84,4.03-3.28-1.05-5.08-4.56-4.03-7.84,1.05-3.27,4.56-5.08,7.84-4.03,3.28,1.05,5.08,4.56,4.03,7.84h0Z" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M96.43,129.21c-1.08-3.27.7-6.79,3.97-7.86,3.27-1.07,6.79.71,7.86,3.97,1.08,3.27-.7,6.79-3.97,7.86-3.27,1.07-6.79-.71-7.86-3.97h0Z" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M104.84,103.03c2.78-2.03,6.67-1.43,8.7,1.35,2.03,2.78,1.43,6.67-1.35,8.71-2.78,2.03-6.67,1.43-8.7-1.35-2.03-2.78-1.43-6.67,1.35-8.7h0Z" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M132.35,102.94c2.79,2.01,3.42,5.9,1.41,8.69-2.02,2.79-5.91,3.42-8.7,1.41-2.79-2.02-3.42-5.91-1.41-8.7,2.01-2.79,5.91-3.42,8.69-1.41h0Z" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M118.5,73.16c2.04,0,4,.42,5.8,1.2.64.28,1.38.03,1.73-.58.48-.86,1.17-1.6,2.04-2.13.92-.57,1.96-.87,3-.89.13,0,.27,0,.41,0,.46.02.87-.07,1.28-.29.28-.15.6-.24.94-.24,1.1,0,1.99.88,2,1.99s-.89,1.99-1.99,1.99c-.77,0-1.44-.43-1.77-1.07-.28-.53-.83-.81-1.42-.72-.56.09-1.09.29-1.59.59-.67.41-1.19.99-1.54,1.66,0,.01-.01.02-.02.04-.3.59-.14,1.28.37,1.69,2.94,2.31,5.03,5.65,5.63,9.34.27,1.68-1.22,2.99-2.78,2.34-3.73-1.57-7.79-2.43-12.05-2.42s-8.32.9-12.03,2.49c-1.57.67-3.06-.64-2.8-2.32.57-3.69,2.65-7.05,5.57-9.37.51-.41.66-1.11.36-1.69,0-.01-.01-.02-.02-.04-.35-.67-.88-1.24-1.55-1.65-.49-.3-1.04-.5-1.59-.58-.59-.09-1.14.19-1.41.72-.33.64-1,1.07-1.76,1.08-1.1,0-1.99-.88-1.99-1.98s.88-1.99,1.98-2c.34,0,.66.08.94.23.41.22.82.31,1.28.28.14,0,.28-.01.41,0,1.04.02,2.08.31,3.01.87.87.53,1.57,1.27,2.06,2.12.35.61,1.09.85,1.73.57,1.79-.79,3.76-1.23,5.79-1.24h0Z" style={{fill:"black",fillRule:"evenodd"}}/>
    <path d="M119.58,90.1c0-.6.23-1.12.67-1.52.45-.4.98-.58,1.58-.52,16.27,1.68,29.01,16.13,29.06,33.74.06,17.62-12.59,32.14-28.84,33.93" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M115.49,155.76c-16.27-1.68-29.01-16.13-29.06-33.74-.06-17.62,12.59-32.14,28.84-33.93.6-.06,1.13.11,1.58.51.45.4.68.92.68,1.52" style={{fill:"#e41e26",fillRule:"evenodd"}}/>
    <path d="M113.63,104.32c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style={{fill:"#1a0505",fillRule:"evenodd"}}/>
    <path d="M133.81,104.25c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.43-6.03,1.37-8.85h0Z" style={{fill:"#1a0505",fillRule:"evenodd"}}/>
    <path d="M140.11,123.42c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.43,6.03-1.37,8.85,2.07,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style={{fill:"#1a0505",fillRule:"evenodd"}}/>
    <path d="M123.82,135.24c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.06-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.06,3.43-6.03,1.37-8.85h0Z" style={{fill:"#1a0505",fillRule:"evenodd"}}/>
    <path d="M107.46,123.53c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style={{fill:"#1a0505",fillRule:"evenodd"}}/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   TEXT ROLL
═══════════════════════════════════════════════════════════ */
const ROLL_STAGGER = 0.028;

const RollLabel = ({ children, isHovered }: { children: string; isHovered: boolean }) => {
  const chars = children.split("");
  return (
    <span style={{ position: "relative", display: "inline-block", overflow: "hidden", lineHeight: 1, verticalAlign: "top" }}>
      {/* visible row */}
      <span aria-hidden style={{ display: "block" }}>
        {chars.map((l, i) => (
          <motion.span key={i} animate={isHovered ? { y: "-100%" } : { y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.36, delay: ROLL_STAGGER * i }}
            style={{ display: "inline-block" }}>
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
      {/* roll-in row */}
      <span aria-hidden style={{ display: "block", position: "absolute", inset: 0 }}>
        {chars.map((l, i) => (
          <motion.span key={i} animate={isHovered ? { y: 0 } : { y: "100%" }}
            transition={{ ease: "easeInOut", duration: 0.36, delay: ROLL_STAGGER * i }}
            style={{ display: "inline-block" }}>
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </span>
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROLL BUTTON
═══════════════════════════════════════════════════════════ */
interface RollButtonProps {
  label?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export default function RollButton({
  label = "Connect With Studio",
  onClick,
  href,
  target,
}: RollButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const inner = (
    <motion.span
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      onClick={href ? undefined : onClick}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px 6px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        overflow: "hidden",
        textDecoration: "none",
        userSelect: "none",
        outline: "none",
        background: "#f2ede6",
        color: "#c8372d",
        border: "1px solid #c8372d",
        transition: "box-shadow 0.3s ease, background 0.25s ease",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Bug track */}
      <span style={{ position: "relative", display: "flex", alignItems: "center", width: 56, height: 38, flexShrink: 0, overflow: "hidden", marginRight: 2 }}>
        <motion.span
          animate={isHovered ? { x: [0, 58, -58, 0] } : { x: 0 }}
          transition={isHovered
            ? { duration: 0.68, ease: [0.16, 1, 0.3, 1], times: [0, 0.44, 0.45, 1] }
            : { duration: 0.36, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", rotate: "90deg" }}
        >
          <BugIcon />
        </motion.span>
      </span>

      {/* Divider */}
      <span style={{ width: 1, height: 22, background: "rgba(200,55,45,0.2)", flexShrink: 0, margin: "0 12px", borderRadius: 1 }} />

      {/* Label only — no arrow */}
      <RollLabel isHovered={isHovered}>{label}</RollLabel>

    </motion.span>
  );

  /* ── Routing ── */
  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target={target ?? "_blank"} rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} target={target} style={{ textDecoration: "none" }}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      {inner}
    </button>
  );
}