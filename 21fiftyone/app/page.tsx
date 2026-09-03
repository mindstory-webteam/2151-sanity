import Script from "next/script";

import About1 from "@/component/About1";
import AboutSection from "@/component/Aboutsection";

import BenefitSection from "@/component/BenefitSection";
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
  "telephone": "077364 02151",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Pantheeramkavu",
    "addressLocality": "Kozhikode",
    "postalCode": "673014",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 11.2474739,
    "longitude": 75.8337082
  }
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "21fiftyone",
  "url": "https://21fiftyone.com/",
  "logo": "https://21fiftyone.com/logo/2151-logo.png",
  "sameAs": [
    "https://www.facebook.com/share/1Aw4MkQKzk/?mibextid=wwXIfr",
    "https://www.instagram.com/21fiftyone?igsh=MXV2NTI3M2QzMTMwZw=="
  ]
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org/",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "about",
    "item": "https://21fiftyone.com/about"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "services",
    "item": "https://21fiftyone.com/services"
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
      <About1 />

      <AboutSection />

      <Features />

      <BenefitSection />
      {/* <StickyVideoSection /> */}

      <ProjectsScroll />

      <BreakTheMold />
      <Footer />

    </div>
  );
}