import type { Metadata } from "next";

import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import TermsConditionsSection from "@/component/Termsconditions";





import Image from "next/image";

export const metadata: Metadata = {
  title: "Terms & Conditions | 21FiftyOne",
  description:
    "Review the Terms & Conditions governing the use of the 21FiftyOne website, its content, services, intellectual property and project engagements.",
  alternates: {
    canonical: "https://21fiftyone.com/terms-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | 21FiftyOne",
    description:
      "Review the Terms & Conditions governing the use of the 21FiftyOne website, its content, services, intellectual property and project engagements.",
    url: "https://21fiftyone.com/terms-conditions",
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
        <TermsConditionsSection />
        
        <Footer />
       
   
    </div>
  );
}