import Script from "next/script";

import About1 from "@/component/About1";
import AboutSection from "@/component/Aboutsection";


import  BenefitSection  from "@/component/BenefitSection";
import BreakTheMold from "@/component/Breakthemold";


import Features from "@/component/Features";
import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import HeroSection from "@/component/Herosection";

import ProjectsScroll from "@/component/Projectsscroll";
import SocialFloat from "@/component/Socialfloat";

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

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "21fiftyone",
  "image": "https://21fiftyone.com/logo/2151-logo.png",
  "@id": "https://21fiftyone.com/",
  "url": "https://21fiftyone.com/",
  "telephone": "+91 82816 10051",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Regus Door No. 2703, Cabin 721, HiLITE Business Park, 7th Floor, Tower 2, Pantheeramkavu",
    "addressLocality": "Kozhikode",
    "postalCode": "673014",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 11.247482,
    "longitude": 75.833709
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
    "opens": "10:00",
    "closes": "18:00"
  },
  "sameAs": [
    "https://www.instagram.com/21fiftyone?igsh=MXV2NTI3M2QzMTMwZw==",
    "https://www.facebook.com/share/1Aw4MkQKzk/?mibextid=wwXIfr"
  ]
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "21fiftyone",
  "alternateName": "21fiftyone",
  "url": "https://21fiftyone.com/",
  "logo": "https://21fiftyone.com/logo/2151-logo.png"
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Services",
    "item": "https://21fiftyone.com/services"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Contact",
    "item": "https://21fiftyone.com/contact"
  }]
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans ">

      <Script
        id="local-business-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* <SectionBug/> */}
     
        <FloatingNavbar />
        <HeroSection />
        {/* <SocialFloat  /> */}
         {/* <CraftingCulture /> */}
         <About1/> 

          <AboutSection />
           
          <Features/>
       
        
        <BenefitSection />
        {/* <StickyVideoSection /> */}
      
     

       
         

          <ProjectsScroll />
      
    
        <BreakTheMold />
        <Footer />
       
   
    </div>
  );
}