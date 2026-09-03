import type { Metadata } from "next";

import { getAllPosts } from "@/lib/sanity/queries";
import BlogListClient from "../../component/BlogListClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Video Production & Filmmaking Insights | 21FiftyOne",
  description:
    "Read insights from 21FiftyOne on cinematography, storytelling, video production, creative direction, AI content and the craft behind visual experiences.",
  alternates: {
    canonical: "https://21fiftyone.com/blog",
  },
  openGraph: {
    title: "Video Production & Filmmaking Insights | 21FiftyOne",
    description:
      "Read insights from 21FiftyOne on cinematography, storytelling, video production, creative direction, AI content and the craft behind visual experiences.",
    url: "https://21fiftyone.com/blog",
    siteName: "21FiftyOne",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogListClient posts={posts} />;
}