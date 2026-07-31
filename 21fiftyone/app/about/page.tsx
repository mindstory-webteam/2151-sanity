



import FivePillarsSection from "@/component/Fivepillarssection";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import Hero2 from "@/component/Hero2";
import BreakTheMold from "@/component/Breakthemold";


import Image from "next/image";
import ProjectsSection from "@/component/Projectssection";
import StatsSection from "@/component/StatsSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">
    
      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        <Hero2/>
        <StatsSection />
         <ProjectsSection />
        <FivePillarsSection  />
       
         <BreakTheMold />
      
        <Footer />
       
   
    </div>
  );
}
