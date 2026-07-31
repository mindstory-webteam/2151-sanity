import { notFound } from "next/navigation";
import { getAllPosts, getAllPostSlugs, getPostBySlug } from "@/lib/sanity/queries";
import BlogDetailClient from "@/component/BlogDetailClient";

export const revalidate = 60;

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

  return {
    title: `${post.title} | 21FiftyOne Studio`,
    description: post.excerpt,
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