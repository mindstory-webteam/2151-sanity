"use client";

import type { CSSProperties, ElementType } from "react";
import React from "react";

/* ═══════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════ */
interface SplitTextProps {
  text: string;
  className?: string;
  textAlign?: CSSProperties["textAlign"];
  tag?: ElementType;

  /**
   * Deprecated — animation (both the old hover-roll and the
   * scroll-reveal GSAP entrance) has been removed. These props
   * are kept ONLY so existing call sites don't fail to compile.
   * They are accepted but intentionally unused.
   */
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: Record<string, number | undefined>;
  to?: Record<string, number | undefined>;
  threshold?: number;
  rootMargin?: string;
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
  hoverRoll?: boolean;
  hoverRollDirection?: "left" | "right" | "center";
  autoRoll?: boolean;
  autoRollInterval?: number;
  autoRollDuration?: number;
}

/* ═══════════════════════════════════════════════════════════
   SplitText — now just plain text, no animation.

   All GSAP scroll-triggered entrance animation and the old
   hover-roll behavior have been removed. The component simply
   renders `text` inside the given tag. Props related to
   animation are still accepted (and ignored) so nothing calling
   this component elsewhere needs to change.
═══════════════════════════════════════════════════════════ */
export default function SplitText({
  text,
  className = "",
  textAlign = "left",
  tag: Tag = "div",
}: SplitTextProps) {
  return (
    <Tag className={className} style={{ textAlign, lineHeight: "inherit" }}>
      {text}
    </Tag>
  );
}