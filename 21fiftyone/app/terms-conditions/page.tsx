





import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import TermsConditionsSection from "@/component/Termsconditions";





import Image from "next/image";

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
