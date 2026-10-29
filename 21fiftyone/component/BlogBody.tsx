"use client";

import { PortableText, type PortableTextComponents } from "next-sanity";
import { urlForImage } from "@/lib/sanity/image";

const textColor = "#3d3d3d";
const headingColor = "#1a1a1a";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p style={{ color: textColor, margin: "0 0 1.25em", lineHeight: 1.8 }}>{children}</p>
    ),
    h2: ({ children }) => (
      <h2 style={{ color: headingColor, fontSize: "1.75rem", fontWeight: 600, margin: "2em 0 0.75em", lineHeight: 1.3 }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ color: headingColor, fontSize: "1.4rem", fontWeight: 600, margin: "1.75em 0 0.6em", lineHeight: 1.3 }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 style={{ color: headingColor, fontSize: "1.2rem", fontWeight: 600, margin: "1.5em 0 0.5em", lineHeight: 1.3 }}>
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        style={{ borderLeft: `3px solid ${headingColor}`, paddingLeft: "1em", margin: "1.5em 0", fontStyle: "italic", color: textColor }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ listStyle: "disc", paddingLeft: "1.5em", margin: "0 0 1.5em", color: textColor }}>{children}</ul>
    ),
    number: ({ children }) => (
      <ol style={{ listStyle: "decimal", paddingLeft: "1.5em", margin: "0 0 1.5em", color: textColor }}>{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li style={{ color: textColor, opacity: 1, marginBottom: "0.6em", lineHeight: 1.8 }}>{children}</li>
    ),
    number: ({ children }) => (
      <li style={{ color: textColor, opacity: 1, marginBottom: "0.6em", lineHeight: 1.8 }}>{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: headingColor, fontWeight: 600 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: headingColor, textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      const img = urlForImage(value);
      if (!img) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.width(1200).auto("format").url()}
          alt={value?.alt || ""}
          loading="lazy"
          style={{ width: "100%", height: "auto", borderRadius: 8, margin: "1.5em 0", display: "block" }}
        />
      );
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BlogBody({ value }: { value: any }) {
  if (!value) return null;
  return (
    <div className="blog-body" style={{ maxWidth: 720, margin: "0 auto", fontSize: "1.125rem" }}>
      <PortableText value={value} components={components} />
    </div>
  );
}