import type { Metadata } from "next";

import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import Portfolio from "@/component/Portfolio";
import Hero3 from "@/component/Hero3";

export const metadata: Metadata = {
  title: "Creative Production Studio in Kozhikode | 21FiftyOne",
  description:
    "Explore the work of 21FiftyOne, a creative production studio producing cinematic videos, brand films, AI content, campaigns and visual storytelling.",
  alternates: {
    canonical: "https://21fiftyone.com/studio",
  },
  openGraph: {
    title: "Creative Production Studio in Kozhikode | 21FiftyOne",
    description:
      "Explore the work of 21FiftyOne, a creative production studio producing cinematic videos, brand films, AI content, campaigns and visual storytelling.",
    url: "https://21fiftyone.com/studio",
    siteName: "21FiftyOne",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <FloatingNavbar />
      <Hero3 />
      {/* <FeaturedCaseStudy /> */}
      <Portfolio />
      <Footer />
    </div>
  );
}