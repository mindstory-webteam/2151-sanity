import type { Metadata } from "next";

import Careers from "@/component/Careers";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";




import Image from "next/image";

export const metadata: Metadata = {
  title: "Careers at 21FiftyOne | Creative Production Jobs",
  description:
    "Join 21FiftyOne and explore career opportunities in cinematography, AI content, brand film direction, motion design and production coordination.",
  alternates: {
    canonical: "https://21fiftyone.com/careers",
  },
  openGraph: {
    title: "Careers at 21FiftyOne | Creative Production Jobs",
    description:
      "Join 21FiftyOne and explore career opportunities in cinematography, AI content, brand film direction, motion design and production coordination.",
    url: "https://21fiftyone.com/careers",
    siteName: "21FiftyOne",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
    
      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        {/* <HeroSection /> */}
        <Careers />
       
        <Footer />
       
   
    </div>
  );
}