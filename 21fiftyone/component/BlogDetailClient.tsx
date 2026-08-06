"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import FloatingNavbar from "./Floatingnavbar";
import Footer from "./Footer";
import RollButton from "./Rollbutton";
import SplitText from "./Splittext";
import { urlForImage } from "@/lib/sanity/image";
import type { Post } from "@/lib/sanity/types";

interface Props {
  post: Post;
  allPosts: Post[];
}

export default function BlogDetailClient({ post, allPosts }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mainImageFailed, setMainImageFailed] = useState(false);

  useEffect(() => {
    setMainImageFailed(false);
  }, [post._id]);

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
      { threshold: 0.1 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [post]);

  // Precompute safe URLs once — urlForImage() returns null when a post has
  // no actual uploaded asset (e.g. alt text was set but the image was
  // never selected in Studio), so every consumer must check for that.
  const mainImageBuilder = post.mainImage ? urlForImage(post.mainImage) : null;
  const mainImageUrl = mainImageBuilder
    ? mainImageBuilder.width(1400).height(744).url()
    : null;

  const authorImageBuilder = post.author?.image ? urlForImage(post.author.image) : null;
  const authorImageUrl = authorImageBuilder
    ? authorImageBuilder.width(112).height(112).url()
    : null;

  const portableTextComponents: PortableTextComponents = {
    types: {
      image: ({ value }) => {
        const builder = urlForImage(value);
        if (!builder) return null; // skip silently if asset is missing

        return (
          <div className="blog-body-image">
            <Image
              src={builder.width(1200).url()}
              alt={value.alt || post.title}
              fill
              sizes="(max-width: 900px) 100vw, 720px"
              className="object-cover"
            />
          </div>
        );
      },
    },
    block: {
      h2: ({ children }) => <h2 className="blog-body-h2">{children}</h2>,
      h3: ({ children }) => <h3 className="blog-body-h3">{children}</h3>,
      normal: ({ children }) => <p className="blog-body-p">{children}</p>,
      blockquote: ({ children }) => (
        <div className="blog-quote-block">
          <blockquote>{children}</blockquote>
        </div>
      ),
    },
    marks: {
      link: ({ children, value }) => (
        
        <a  href={value?.href}
          className="blog-body-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <style>{`
        :root {
          --cream:    #f2ede6;
          --black:    #0c0c0c;
          --red:      #c8372d;
          --muted:    #8a8480;
          --line:     rgba(12,12,12,0.12);
        }

        * { box-sizing: border-box; }

        .post-wrap { width: 100%; background: var(--cream); }

        .post-layout {
          max-width: 1320px;
          margin: 0 auto;
          padding-top: 160px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          gap: 0;
          align-items: start;
          overflow-x: hidden;
        }

        .post-sidebar {
          position: sticky;
          top: 120px;
          padding: 0 64px 80px 32px;
          border-left: 1px solid var(--line);
          height: calc(100vh - 160px);
          overflow-y: auto;
        }
        .post-sidebar-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .post-sidebar-eyebrow::before {
          content: '';
          width: 20px; height: 1px;
          background: var(--red);
        }
        .post-nav-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .post-nav-item {
          display: flex;
          gap: 12px;
          padding: 14px 14px;
          border-radius: 8px;
          text-decoration: none;
          border-left: 2px solid transparent;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .post-nav-item:hover { background: rgba(12,12,12,0.04); }
        .post-nav-item.active {
          border-left-color: var(--red);
          background: rgba(200,55,45,0.06);
        }
        .post-nav-index {
          font-family: 'Anton', sans-serif;
          font-size: 11px;
          color: var(--muted);
          padding-top: 2px;
          flex-shrink: 0;
        }
        .post-nav-item.active .post-nav-index { color: var(--red); }
        .post-nav-title {
          font-family: 'DM Sans', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.4;
          color: var(--black);
        }
        .post-nav-item.active .post-nav-title { color: var(--red); }
        .post-nav-date {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
          margin-top: 4px;
          display: block;
        }

        .post-main { min-width: 0; overflow-x: hidden; }

        .post-header {
          width: 100%;
          padding: 0 64px;
          max-width: 900px;
        }

        .post-back {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          display: none;
          align-items: center;
          gap: 10px;
          margin-bottom: 44px;
          transition: color 0.25s ease;
        }
        .post-back:hover { color: var(--red); }

        .post-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--red);
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .post-category::before {
          content: '';
          width: 28px; height: 1px;
          background: var(--red);
        }

        .post-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(34px, 5vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--black);
          margin-bottom: 28px;
          padding-left: 4px;
          margin-left: -4px;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .post-meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 48px;
          border-bottom: 1px solid var(--line);
        }
        .post-meta-dot { opacity: 0.5; }

        .post-image-wrap {
          max-width: 1000px;
          margin: 56px 0 0;
          padding: 0 64px;
        }
        .post-image {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 8.5;
          border-radius: 16px;
          overflow: hidden;
          background: #e5ded3;
        }
        .post-image::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 3px; height: 64px;
          background: var(--red);
        }
        .post-image-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .post-article {
          max-width: 720px;
          padding: 64px 64px 40px;
          font-family: 'DM Sans', sans-serif;
        }

        .blog-body-p {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 17px;
          line-height: 1.9;
          color: #3a3735;
          margin: 0 0 26px;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .blog-body-h2 {
          font-family: 'Anton', sans-serif;
          font-size: 30px;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: var(--black);
          margin: 52px 0 22px;
          line-height: 1.15;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .blog-body-h3 {
          font-family: 'Anton', sans-serif;
          font-size: 22px;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: var(--black);
          margin: 40px 0 18px;
          line-height: 1.2;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .blog-body-link {
          color: var(--red);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .blog-body-image {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 12px;
          overflow: hidden;
          margin: 44px 0;
        }

        .blog-quote-block {
          padding: 36px 40px;
          background: #eae4db;
          border-radius: 12px;
          position: relative;
          margin: 44px 0;
        }
        .blog-quote-block::before {
          content: '\u201C';
          font-family: 'Playfair Display', serif;
          font-size: 100px;
          color: var(--red);
          opacity: 0.15;
          position: absolute;
          top: -8px; left: 20px;
          line-height: 1;
          pointer-events: none;
        }
        .blog-quote-block blockquote {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 21px;
          line-height: 1.55;
          color: var(--black);
          position: relative;
          z-index: 1;
          margin: 0;
        }

        .post-author-card {
          max-width: 720px;
          margin: 24px 0 0;
          padding: 0 64px;
        }
        .post-author-inner {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 32px 36px;
          background: #eae4db;
          border-radius: 12px;
        }
        .post-author-avatar {
          position: relative;
          width: 56px; height: 56px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--muted);
        }
        .post-author-name {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--black);
          margin-bottom: 4px;
        }
        .post-author-bio {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--muted);
          margin: 0;
        }

        .post-cta-row {
          max-width: 720px;
          padding: 56px 64px 120px;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .post-mobile-nav { display: none; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
                      transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        [data-reveal].revealed { opacity: 1; transform: translateY(0); }
        [data-reveal][data-d="1"] { transition-delay: 0.06s; }
        [data-reveal][data-d="2"] { transition-delay: 0.14s; }
        [data-reveal][data-d="3"] { transition-delay: 0.22s; }
        [data-reveal][data-d="4"] { transition-delay: 0.30s; }

        @media (max-width: 1000px) {
          .post-layout { grid-template-columns: 1fr; padding-top: 140px; }
          .post-sidebar { display: none; }
          .post-mobile-nav {
            display: block;
            padding: 0 40px 32px;
            overflow-x: auto;
            white-space: nowrap;
          }
          .post-mobile-nav-inner { display: inline-flex; gap: 10px; }
          .post-mobile-nav-item {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 10px 16px;
            border-radius: 999px;
            border: 1px solid var(--line);
            color: var(--muted);
            text-decoration: none;
            flex-shrink: 0;
          }
          .post-mobile-nav-item.active { border-color: var(--red); color: var(--red); }
          .post-back { display: inline-flex; }
          .post-header, .post-image-wrap, .post-article,
          .post-author-card, .post-cta-row { padding-left: 40px; padding-right: 40px; }
        }
        @media (max-width: 560px) {
          .post-layout { padding-top: 120px; }
          .post-mobile-nav { padding: 0 24px 24px; }
          .post-header, .post-image-wrap, .post-article,
          .post-author-card, .post-cta-row { padding-left: 24px; padding-right: 24px; }
          .post-cta-row { flex-direction: column; align-items: flex-start; gap: 20px; }
          .post-author-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <FloatingNavbar />

      <div className="post-wrap" ref={sectionRef}>
        <div className="post-layout">
          <div className="post-main">
            <div className="post-mobile-nav">
              <div className="post-mobile-nav-inner">
                {allPosts.map((p) => (
                  <Link
                    key={p._id}
                    href={`/blog/${p.slug}`}
                    className={`post-mobile-nav-item ${
                      p.slug === post.slug ? "active" : ""
                    }`}
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>

            <header className="post-header">
              <Link href="/blog" className="post-back" data-reveal data-d="1">
                ← All Notes
              </Link>

              {post.categories && post.categories.length > 0 && (
                <p className="post-category" data-reveal data-d="1">
                  {post.categories.map((c) => c.title).join(" / ")}
                </p>
              )}

              <SplitText
                text={post.title}
                tag="h1"
                className="post-title"
                splitType="words"
                delay={35}
                duration={1.1}
                ease="power3.out"
                from={{ opacity: 0, y: 46 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-60px"
                textAlign="left"
              />

              <div className="post-meta" data-reveal data-d="3">
                {post.author?.name && <span>{post.author.name}</span>}
                <span className="post-meta-dot">&middot;</span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            </header>

            {mainImageUrl && (
              <div className="post-image-wrap" data-reveal data-d="4">
                <div className="post-image">
                  {!mainImageFailed ? (
                    <Image
                      src={mainImageUrl}
                      alt={post.mainImage?.alt || post.title}
                      fill
                      priority
                      sizes="(max-width: 900px) 100vw, 1000px"
                      className="object-cover"
                      onError={() => setMainImageFailed(true)}
                    />
                  ) : (
                    <div className="post-image-fallback">
                      Image unavailable
                    </div>
                  )}
                </div>
              </div>
            )}

            <article className="post-article" data-reveal data-d="4">
              {post.body && (
                <PortableText value={post.body} components={portableTextComponents} />
              )}
            </article>

            {post.author?.name && (
              <div className="post-author-card" data-reveal data-d="4">
                <div className="post-author-inner">
                  {authorImageUrl && (
                    <div className="post-author-avatar">
                      <Image
                        src={authorImageUrl}
                        alt={post.author.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="post-author-name">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="post-author-bio">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="post-cta-row" data-reveal data-d="4">
              <RollButton label="All Notes" href="/blog" />
            </div>
          </div>

          <aside className="post-sidebar">
            <p className="post-sidebar-eyebrow">All Notes</p>
            <nav className="post-nav-list">
              {allPosts.map((p, i) => (
                <Link
                  key={p._id}
                  href={`/blog/${p.slug}`}
                  className={`post-nav-item ${p.slug === post.slug ? "active" : ""}`}
                >
                  <span className="post-nav-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="post-nav-title">{p.title}</span>
                    <span className="post-nav-date">
                      {new Date(p.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}