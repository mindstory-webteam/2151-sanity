
import About1 from "@/component/About1";
import AboutSection from "@/component/Aboutsection";


import  BenefitSection  from "@/component/BenefitSection";
import BreakTheMold from "@/component/Breakthemold";
import Contact from "@/component/Contact";


import Features from "@/component/Features";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import HeroSection from "@/component/Herosection";

import ProjectsScroll from "@/component/Projectsscroll";

const NAV_ITEMS = [
  { label: "Collections", ariaLabel: "View Collections", link: "/collections" },
  { label: "Editorial",   ariaLabel: "View Editorial",   link: "/editorial"   },
  { label: "Archive",     ariaLabel: "View Archive",     link: "/archive"     },
  { label: "Studio",      ariaLabel: "View Studio",      link: "/studio"      },
];
 
const SOCIAL_ITEMS = [
  { label: "Instagram", link: "https://instagram.com/21fiftyone" },
  { label: "LinkedIn",  link: "https://linkedin.com/company/21fiftyone" },
  { label: "Behance",   link: "https://behance.net/21fiftyone" },
];

import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
    
      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        {/* <HeroSection /> */}
        <Contact />
        <Footer />
       
   
    </div>
  );
}
