import { notFound } from "next/navigation";
import { getAllPosts, getAllPostSlugs, getPostBySlug } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";
import BlogDetailClient from "@/component/BlogDetailClient";

export const revalidate = 60;

const SITE_URL = "https://21fiftyone.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render every known post at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  // SEO fields fall back to the post's own content when left blank in Studio
  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const canonical = post.seo?.canonicalUrl || `${SITE_URL}/blog/${post.slug}`;
  const ogImage = post.mainImage
    ? urlForImage(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${title} | 21FiftyOne Studio`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch the post and the full list (for the sidebar) in parallel
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} allPosts={allPosts} />;
}