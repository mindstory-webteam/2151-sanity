"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FloatingNavbar from "./Floatingnavbar";
import Footer from "./Footer";
import SplitText from "./Splittext";
import { urlForImage } from "@/lib/sanity/image";
import type { Post } from "@/lib/sanity/types";

interface Props {
  posts: Post[];
}

export default function BlogListClient({ posts }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

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
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [posts]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Playfair+Display:ital,wght@1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --cream:    #f2ede6;
          --black:    #0c0c0c;
          --red:      #c8372d;
          --muted:    #8a8480;
          --line:     rgba(12,12,12,0.12);
          --card-bg:  #ffffff;
        }

        .blog-wrap { width: 100%; background: var(--cream); }

        /* ─── HEADER ─── */
        .blog-hero {
          width: 100%;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top:50px ;
          border-bottom: 1px solid var(--line);
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .blog-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,55,45,0.18), transparent);
          z-index: 2;
        }

        .blog-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.4;
          filter: grayscale(35%);
          z-index: 0;
        }
        .blog-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(242,237,230,0.6) 0%,
            rgba(242,237,230,0.88) 65%,
            var(--cream) 100%
          );
          z-index: 1;
        }

        .blog-hero-inner {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .blog-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--red);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .blog-eyebrow::before,
        .blog-eyebrow::after {
          content: '';
          width: 28px; height: 1px;
          background: var(--red);
        }

        .blog-headline {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .blog-headline-main {
          font-family: 'Anton', sans-serif;
          font-size: clamp(48px, 7.5vw, 108px);
          line-height: 0.95;
          letter-spacing: -0.01em;
          color: var(--black);
          text-transform: uppercase;
          text-align: center;
        }
        .blog-headline-accent {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(40px, 6.4vw, 92px);
          color: var(--red);
          line-height: 1;
          letter-spacing: -0.01em;
          text-align: center;
        }

        .blog-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.8;
          color: #3a3735;
          max-width: 520px;
          margin: 32px auto 0;
        }

        /* ─── GRID SECTION ─── */
        .blog-grid-section {
          width: 100%;
          padding: 80px 64px 140px;
        }
        .blog-empty {
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: var(--muted);
          text-align: center;
          padding: 80px 0;
        }

        .blog-grid {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        /* ─── CARD ─── */
        .blog-card {
          display: flex;
          flex-direction: column;
          background: var(--card-bg);
          border: 0.5px solid var(--line);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          position: relative;
          cursor: pointer;

          transition: border-color 0.3s ease, box-shadow 0.3s ease,
                      opacity 0.75s cubic-bezier(0.16,1,0.3,1),
                      transform 0.75s cubic-bezier(0.16,1,0.3,1);
        }
        .blog-card:hover {
          border-color: rgba(200,55,45,0.22);
          box-shadow: 0 8px 40px rgba(12,12,12,0.08);
        }

        .blog-card-image {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          overflow: hidden;
          background: #e5ded3;
        }
        .blog-card-image img {
          filter: grayscale(30%);
          transition: filter 0.8s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .blog-card:hover .blog-card-image img {
          filter: grayscale(0%);
          transform: scale(1.05);
        }

        .blog-card-body {
          padding: 28px 26px 32px;
          position: relative;
        }

        .blog-card-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--red);
          display: block;
          margin-bottom: 12px;
        }

        .blog-card-title {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          line-height: 1.15;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: var(--black);
          margin-bottom: 12px;
        }

        .blog-card-excerpt {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13.5px;
          line-height: 1.7;
          color: var(--muted);
          margin-bottom: 20px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .blog-card-meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .blog-card-dot { opacity: 0.5; }

        /* watermark index number */
        .blog-card::after {
          content: attr(data-index);
          position: absolute;
          top: 16px;
          right: 20px;
          font-family: 'Anton', sans-serif;
          font-size: 13px;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.85);
          z-index: 2;
        }
        .blog-card:not(:has(.blog-card-image))::after {
          color: rgba(12,12,12,0.28);
          top: 20px;
        }

        /* ─── REVEAL ─── */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.06s; }
        [data-reveal][data-d="2"] { transition-delay: 0.14s; }
        [data-reveal][data-d="3"] { transition-delay: 0.22s; }
        [data-reveal][data-d="4"] { transition-delay: 0.30s; }
        [data-reveal][data-d="5"] { transition-delay: 0.38s; }
        [data-reveal][data-d="6"] { transition-delay: 0.46s; }

        @media (prefers-reduced-motion: reduce) {
          .blog-hero-video { display: none; }
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1100px) {
          .blog-hero { min-height: 44vh; padding: 120px 48px 40px; }
          .blog-grid-section { padding: 64px 48px 120px; }
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .blog-hero { min-height: 40vh; padding: 100px 28px 36px; }
          .blog-grid-section { padding: 56px 28px 100px; }
          .blog-grid { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>

      <FloatingNavbar />

      <div className="blog-wrap" ref={sectionRef}>
        <section className="blog-hero">
          <video
            className="blog-hero-video"
            src="/videos/video-3.webm"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="blog-hero-overlay" />

          <div className="blog-hero-inner">
            <p className="blog-eyebrow" data-reveal data-d="1">
              From The Studio
            </p>
            <h1 className="blog-headline">
              <SplitText
                text="NOTES &"
                tag="span"
                className="blog-headline-main"
                splitType="chars"
                delay={30}
                duration={1}
                ease="power3.out"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-40px"
                textAlign="center"
              />
              <SplitText
                text="Reflections"
                tag="span"
                className="blog-headline-accent"
                splitType="chars"
                delay={26}
                duration={1.1}
                ease="power4.out"
                from={{ opacity: 0, y: 46, skewX: 6 }}
                to={{ opacity: 1, y: 0, skewX: 0 }}
                threshold={0.1}
                rootMargin="-40px"
                textAlign="center"
              />
             
            </h1>
            <p className="blog-hero-sub" data-reveal data-d="4">
              Field notes on cinematography, story structure, and the craft
              behind every frame we cut.
            </p>
          </div>
        </section>

        <section className="blog-grid-section">
          {posts.length === 0 ? (
            <p className="blog-empty" data-reveal>
              No dispatches yet — the studio is still in the edit bay.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((post, i) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                  data-reveal
                  data-d={String(Math.min(i + 1, 6))}
                  data-index={String(i + 1).padStart(2, "0")}
                >
                  {post.mainImage && !failedImages.has(post._id) && (
                    <div className="blog-card-image">
                      <Image
                        src={urlForImage(post.mainImage)
                          .width(700)
                          .height(480)
                          .url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        className="object-cover"
                        onError={() =>
                          setFailedImages((prev) => new Set(prev).add(post._id))
                        }
                      />
                    </div>
                  )}

                  <div className="blog-card-body">
                    {post.categories && post.categories.length > 0 && (
                      <span className="blog-card-category">
                        {post.categories.map((c) => c.title).join(" / ")}
                      </span>
                    )}

                    <h2 className="blog-card-title">{post.title}</h2>

                    {post.excerpt && (
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                    )}

                    <div className="blog-card-meta">
                      {post.author?.name && <span>{post.author.name}</span>}
                      <span className="blog-card-dot">&middot;</span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}