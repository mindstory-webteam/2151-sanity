"use client";

import { useState, useEffect, useRef } from "react";

const socials = [
  {
    label: "WhatsApp",
    href: "https://wa.me/YOUR_NUMBER",
    color: "#25D366",
    hoverColor: "#1ebe57",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/YOUR_HANDLE",
    color: "#E1306C",
    hoverColor: "#c1274f",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:your@email.com",
    color: "#EA4335",
    hoverColor: "#d33426",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@YOUR_CHANNEL",
    color: "#FF0000",
    hoverColor: "#cc0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "Phone",
    href: "tel:+YOUR_NUMBER",
    color: "#0088cc",
    hoverColor: "#0077b5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
    ),
  },
];

const LOGO_SVG = `<svg viewBox="0 0 256.28 244.89" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <path d="M115.49,155.76c-16.27-1.68-29.01-16.13-29.06-33.74-.06-17.62,12.59-32.14,28.84-33.93.6-.06,1.13.11,1.58.51.45.4.68.92.68,1.52l.13,39.47c0,1.28,2.05,1.27,2.04,0l-.13-39.47c0-.6.23-1.12.67-1.52.45-.4.98-.58,1.58-.52,16.27,1.68,29.01,16.13,29.06,33.74.06,17.62-12.59,32.14-28.84,33.93" style="fill:#e41e26;fill-rule:evenodd"/>
  <path d="M120.62,133.05c-3.28-1.05-6.78.75-7.84,4.03-1.05,3.27.75,6.78,4.03,7.84,3.28,1.05,6.78-.75,7.84-4.03,1.05-3.28-.75-6.78-4.03-7.84h0Z" style="fill:#e41e26;fill-rule:evenodd"/>
  <path d="M140.93,129.07c-1.05,3.27-4.56,5.08-7.84,4.03-3.28-1.05-5.08-4.56-4.03-7.84,1.05-3.27,4.56-5.08,7.84-4.03,3.28,1.05,5.08,4.56,4.03,7.84h0Z" style="fill:#e41e26;fill-rule:evenodd"/>
  <path d="M96.43,129.21c-1.08-3.27.7-6.79,3.97-7.86,3.27-1.07,6.79.71,7.86,3.97,1.08,3.27-.7,6.79-3.97,7.86-3.27,1.07-6.79-.71-7.86-3.97h0Z" style="fill:#e41e26;fill-rule:evenodd"/>
  <path d="M104.84,103.03c2.78-2.03,6.67-1.43,8.7,1.35,2.03,2.78,1.43,6.67-1.35,8.71-2.78,2.03-6.67,1.43-8.7-1.35-2.03-2.78-1.43-6.67,1.35-8.7h0Z" style="fill:#e41e26;fill-rule:evenodd"/>
  <path d="M132.35,102.94c2.79,2.01,3.42,5.9,1.41,8.69-2.02,2.79-5.91,3.42-8.7,1.41-2.79-2.02-3.42-5.91-1.41-8.7,2.01-2.79,5.91-3.42,8.69-1.41h0Z" style="fill:#e41e26;fill-rule:evenodd"/>
  <path d="M118.5,73.16c2.04,0,4,.42,5.8,1.2.64.28,1.38.03,1.73-.58.48-.86,1.17-1.6,2.04-2.13.92-.57,1.96-.87,3-.89.13,0,.27,0,.41,0,.46.02.87-.07,1.28-.29.28-.15.6-.24.94-.24,1.1,0,1.99.88,2,1.99s-.89,1.99-1.99,1.99c-.77,0-1.44-.43-1.77-1.07-.28-.53-.83-.81-1.42-.72-.56.09-1.09.29-1.59.59-.67.41-1.19.99-1.54,1.66,0,.01-.01.02-.02.04-.3.59-.14,1.28.37,1.69,2.94,2.31,5.03,5.65,5.63,9.34.27,1.68-1.22,2.99-2.78,2.34-3.73-1.57-7.79-2.43-12.05-2.42s-8.32.9-12.03,2.49c-1.57.67-3.06-.64-2.8-2.32.57-3.69,2.65-7.05,5.57-9.37.51-.41.66-1.11.36-1.69,0-.01-.01-.02-.02-.04-.35-.67-.88-1.24-1.55-1.65-.49-.3-1.04-.5-1.59-.58-.59-.09-1.14.19-1.41.72-.33.64-1,1.07-1.76,1.08-1.1,0-1.99-.88-1.99-1.98s.88-1.99,1.98-2c.34,0,.66.08.94.23.41.22.82.31,1.28.28.14,0,.28-.01.41,0,1.04.02,2.08.31,3.01.87.87.53,1.57,1.27,2.06,2.12.35.61,1.09.85,1.73.57,1.79-.79,3.76-1.23,5.79-1.24h0Z" style="fill:#010101;fill-rule:evenodd"/>
  <g>
    <path d="M113.63,104.32c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style="fill:#010101;fill-rule:evenodd"/>
    <path d="M133.81,104.25c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.43,8.85,1.37,2.82-2.07,3.43-6.03,1.37-8.85h0Z" style="fill:#010101;fill-rule:evenodd"/>
    <path d="M140.11,123.42c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.43,6.03-1.37,8.85,2.07,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style="fill:#010101;fill-rule:evenodd"/>
    <path d="M123.82,135.24c-2.07-2.82-6.03-3.44-8.85-1.37-2.82,2.06-3.44,6.03-1.37,8.85,2.07,2.82,6.03,3.43,8.85,1.37,2.82-2.06,3.43-6.03,1.37-8.85h0Z" style="fill:#010101;fill-rule:evenodd"/>
    <path d="M107.46,123.53c-2.06-2.82-6.03-3.44-8.85-1.37-2.82,2.07-3.44,6.03-1.37,8.85,2.06,2.82,6.03,3.44,8.85,1.37,2.82-2.07,3.44-6.03,1.37-8.85h0Z" style="fill:#010101;fill-rule:evenodd"/>
  </g>
</svg>`;

export default function SocialFloat() {
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const radius = 80;
  const totalItems = socials.length;

  return (
    <>
      <style>{`
        @keyframes sf-entry {
          0%   { transform: translate(-120px, -120px) scale(0.4); opacity: 0; }
          60%  { transform: translate(0, 0) scale(1.08); opacity: 1; }
          80%  { transform: translate(0, 0) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }

        @keyframes sf-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,43,43,0.35); }
          50%       { box-shadow: 0 0 0 10px rgba(212,43,43,0); }
        }

        @keyframes sf-pop {
          0%   { transform: translate(var(--tx), var(--ty)) scale(0.3); opacity: 0; }
          70%  { transform: translate(0,0) scale(1.12); opacity: 1; }
          100% { transform: translate(0,0) scale(1); }
        }

        @keyframes sf-hide {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0.3); opacity: 0; }
        }

        .sf-wrap {
          position: fixed;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sf-main {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fff;
          border: 2px solid #e41e26;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          animation: sf-pulse 2.5s ease-in-out infinite;
          z-index: 2;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .sf-main.sf-entered {
          animation: sf-entry 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards,
                     sf-pulse 2.5s ease-in-out 0.7s infinite;
        }

        .sf-main:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 24px rgba(212,43,43,0.3);
        }

        .sf-main.open {
          transform: scale(1.12) rotate(45deg);
          animation: none;
          box-shadow: 0 6px 24px rgba(212,43,43,0.35);
        }

        .sf-social {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, filter 0.15s ease;
          text-decoration: none;
          z-index: 1;
        }

        .sf-social:hover {
          transform: scale(1.18) !important;
          filter: brightness(1.1);
        }

        .sf-social.sf-show {
          animation: sf-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        .sf-social.sf-hide {
          animation: sf-hide 0.25s ease-in forwards;
        }

        .sf-tooltip {
          position: absolute;
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
          background: rgba(13,13,13,0.85);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 4px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .sf-social:hover .sf-tooltip {
          opacity: 1;
        }
      `}</style>

      <div className="sf-wrap" ref={ref}>
        {socials.map((s, i) => {
          const angle = -90 + (i / (totalItems - 1)) * 180;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;

          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`sf-social ${open ? "sf-show" : "sf-hide"}`}
              style={{
                background: s.color,
                left: `calc(50% - 22px + ${x}px)`,
                top: `calc(50% - 22px + ${y}px)`,
                animationDelay: open ? `${i * 50}ms` : `${(totalItems - 1 - i) * 40}ms`,
                ["--tx" as string]: `${-x}px`,
                ["--ty" as string]: `${-y}px`,
              }}
              title={s.label}
            >
              {s.icon}
              <span className="sf-tooltip">{s.label}</span>
            </a>
          );
        })}

        <button
          className={`sf-main ${entered ? "sf-entered" : ""} ${open ? "open" : ""}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle social links"
          style={{ animationPlayState: open ? "paused" : "running" }}
        >
          <span dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
        </button>
      </div>
    </>
  );
}