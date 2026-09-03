import type { Metadata } from "next";

import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import PrivacyPolicySection from "@/component/Privacypolicy";





import Image from "next/image";

export const metadata: Metadata = {
  title: "Privacy Policy | 21FiftyOne",
  description:
    "Read the 21FiftyOne Privacy Policy to learn how we collect, use, protect and manage personal information submitted through our website.",
  alternates: {
    canonical: "https://21fiftyone.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | 21FiftyOne",
    description:
      "Read the 21FiftyOne Privacy Policy to learn how we collect, use, protect and manage personal information submitted through our website.",
    url: "https://21fiftyone.com/privacy-policy",
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
        <PrivacyPolicySection />
        
        <Footer />
       
   
    </div>
  );
}