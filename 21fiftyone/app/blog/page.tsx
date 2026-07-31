import { getAllPosts } from "@/lib/sanity/queries";
import BlogListClient from "../../component/BlogListClient";

export const revalidate = 60;

export const metadata = {
  title: "Notes & Reflections | 21FiftyOne Studio",
  description:
    "Field notes on cinematography, story structure, and the craft behind every frame we cut.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogListClient posts={posts} />;
}