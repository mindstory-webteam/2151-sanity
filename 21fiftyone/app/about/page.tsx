import type { Metadata } from "next";

import FivePillarsSection from "@/component/Fivepillarssection";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import Hero2 from "@/component/Hero2";
import BreakTheMold from "@/component/Breakthemold";
import ProjectsSection from "@/component/Projectssection";
import StatsSection from "@/component/StatsSection";

export const metadata: Metadata = {
  title: "About 21FiftyOne | Video Production Studio in Kozhikode",
  description:
    "Discover 21FiftyOne, a creative production studio crafting cinematic films, brand stories, digital content and visual experiences with creativity and precision.",
  alternates: {
    canonical: "https://21fiftyone.com/about",
  },
  openGraph: {
    title: "About 21FiftyOne | Video Production Studio in Kozhikode",
    description:
      "Discover 21FiftyOne, a creative production studio crafting cinematic films, brand stories, digital content and visual experiences with creativity and precision.",
    url: "https://21fiftyone.com/about",
    siteName: "21FiftyOne",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <FloatingNavbar />
      <Hero2 />
      <StatsSection />
      <ProjectsSection />
      <FivePillarsSection />
      <BreakTheMold />
      <Footer />
    </div>
  );
}