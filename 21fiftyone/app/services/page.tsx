import FloatingNavbar from "@/component/Floatingnavbar";
import Footer from "@/component/Footer";
import ServicesSection from "@/component/Servicessection";
import FeaturedCaseStudy from "@/component/Featuredcasestudy";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
      <FloatingNavbar />
      < FeaturedCaseStudy />

      <ServicesSection
        sectionEyebrow="What We Do"
        sectionTitle="SERVICES BUILT FOR THE"
        sectionTitleAccent="Future."
        sectionDesc="Every project is crafted with purpose and precision.
 We create cinematic content and visual experiences that go beyond trends—designed to connect, engage, and leave a lasting impact."
        footerLabel="Engineered with Precision"
        services={[
          {
            id: 1,
            eyebrow: "Service 01",
            heroTitle: "VISUAL PRODUCTION",
            heroTitleAccent: "CRAFTED FOR ",
            heroDesc:
              " We create high-quality visual content that captures attention and communicates your brand with clarity. From concept to execution, every frame is designed to engage and inspire.",
            heroVideo: "/videos/banner/s-1.webm",
            heroPoints: [
              "High-end video production across formats",
              "Visual storytelling tailored to brand identity",
              "Creative direction and on-set execution",
              "Designed for digital, social, and campaigns",
              "Consistent visual language across outputs",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Ritual.",
            ritualTagline: "A THREE-STEP PROCESS FOR BRAND CREATION",
            ritualSteps: [
              {
                num: "01",
                title: "Concept",
                desc: " We define the visual direction aligned with your brand and objectives.",
              },
              {
                num: "02",
                title: " Production",
                desc: "We execute with precision using the right crew, tools, and techniques.",
              },
              {
                num: "03",
                title: " Refinement",
                desc: " We enhance visuals through editing, grading, and finishing touches.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Concept & Storyboards" },
              { label: "Video Content (Multi-format)" },
              { label: "Edited & Color Graded Assets" },
              { label: "Social Media Cuts" },
              { label: "Visual Asset Library" },
              
            ],
            faq: [
              {
                question: "How long does a visual production project take?",
                answer:
                  " Timelines typically range from 2–6 weeks depending on scope, complexity, and number of deliverables.",
              },
              {
                question: "Do you handle both shooting and editing?",
                answer:
                  " Yes. We manage the entire process—from concept and shoot to editing and final delivery.",
              },
              {
                question: "Can you create content for social media?",
                answer:
                  " Absolutely. We produce optimized content tailored for all major platforms.",
              },
              {
                question: "Do you work with existing brand guidelines?",
                answer:
                  " Yes. We can align with your current identity or help refine it if needed.",
              },
              
            ],
            ctaLabel: "View Brand Work",
            ctaHref: "/studio",
          },
          {
            id: 2,
            eyebrow: "Service 02",
            heroTitle: "MOVIE PRODUCTION",
            heroTitleAccent: "Storytelling.",
            heroDesc:
              "From script to screen, we produce cinematic films that tell powerful stories. Every project is approached with artistic depth and production excellence.",
            heroVideo: "/videos/banner/s-2.webm",
            heroPoints: [
              "Feature films and short films",
              "Script development and storytelling",
              "Cinematic direction and production design",
              "High-end post-production workflows",
              "Emotion-driven narratives",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Method.",
            ritualTagline: "THREE STAGES OF CAMPAIGN ALCHEMY",
            ritualSteps: [
              {
                num: "01",
                title: " Development",
                desc: " Scriptwriting, ideation, and narrative structure.",
              },
              {
                num: "02",
                title: "Production",
                desc: "Filming with cinematic precision and direction.",
              },
              {
                num: "03",
                title: " Post-Production",
                desc: "Editing, sound, and final storytelling polish.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Script & Story Development" },
              { label: "Full-Length / Short Film" },
              { label: "Cinematic Edits" },
              { label: "Sound Design & Score" },
              { label: "Final Master Output" },
              
            ],
            faq: [
              {
                question: "Do you handle scriptwriting and concept development?",
                answer:
                  " Yes. We support everything from ideation to final screenplay.",
              },
              {
                question: "What types of films do you produce?",
                answer:
                  " We create short films, feature films, and branded cinematic content.",
              },
              {
                question: "How involved can we be in the process?",
                answer:
                  " As involved as you like—we collaborate closely at every stage..",
              },
              {
                question: "Do you handle post-production as well?",
                answer:
                  " Yes. Editing, sound design, color grading, and final mastering are all included.",
              },
            ],
            ctaLabel: "View Campaign Work",
            ctaHref: "/studio",
          },
          {
            id: 3,
            eyebrow: "Service 03",
            heroTitle: "CORPORATE FILMS",
            heroTitleAccent: "Inhabit.",
            heroDesc:
              " We create corporate films that communicate your brand’s vision, values, and strengths—building credibility and connection with your audience.",
            heroVideo: "/videos/banner/s-3.webm",
            heroPoints: [
              "Company profile videos",
              "Brand storytelling films",
              "Internal and training videos",
              "Professional and structured messaging",
              "Designed for business impact",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Process.",
            ritualTagline: "THREE PILLARS OF DIGITAL CRAFT",
            ritualSteps: [
              {
                num: "01",
                title: "Understanding",
                desc: "We align with your business goals and messaging.",
              },
              {
                num: "02",
                title: "Structuring",
                desc: "We build a clear and engaging narrative.",
              },
              {
                num: "03",
                title: " Execution",
                desc: "We produce and refine for clarity and impact.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Corporate Film" },
              { label: "Script & Voiceover" },
              { label: "Interview & B-roll Footage" },
              { label: "Edited Video Assets" },
              { label: "Presentation-ready Formats" },
              { label: "Performance & QA Report" },
            ],
            faq: [
              {
                question: "What is the ideal length for a corporate film?",
                answer:
                  " Typically 2–5 minutes, depending on the message and platform.",
              },
              {
                question: "Can you help with scripting and messaging?",
                answer:
                  " Yes. We craft clear, professional narratives aligned with your business goals.",
              },
              {
                question: "Do you shoot on-location?",
                answer:
                  "Yes. We film at offices, factories, or any required location.",
              },
              {
                question: "Can the video be used across platforms?",
                answer:
                  "Absolutely. We deliver formats suitable for presentations, websites, and social media.",
              },
              
            ],
            ctaLabel: "View Digital Work",
            ctaHref: "/studio",
          },
           {
            id: 4,
            eyebrow: "Service 04",
            heroTitle: "COMMERCIAL PRODUCTION",
            heroTitleAccent: "Attention.",
            heroDesc:
              "  We produce high-impact commercials that capture attention instantly and drive results across platforms.",
            heroVideo: "/videos/banner/s-4.webm",
            heroPoints: [
              "TV & digital advertisements",
              "Product and brand commercials",
              "Campaign-driven storytelling",
              "Performance-focused creatives",
              "Fast-paced, engaging visuals",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Process.",
            ritualTagline: "THREE PILLARS OF DIGITAL CRAFT",
            ritualSteps: [
              {
                num: "01",
                title: "Strategy",
                desc: " We define campaign goals and creative direction.",
              },
              {
                num: "02",
                title: "Production",
                desc: " We execute high-quality commercial shoots.",
              },
              {
                num: "03",
                title: "Optimization",
                desc: " We refine content for performance and reach.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Ad Films (TV/Digital)" },
              { label: "Campaign Concept" },
              { label: "Multiple Format Outputs" },
              { label: "Performance Variations" },
              { label: "Final Optimized Assets" },
              
            ],
            faq: [
              {
                question: "Do you create ads for both TV and digital platforms?",
                answer:
                  " Yes. We produce commercials optimized for all channels.",
              },
              {
                question: "Can you handle campaign concepts as well?",
                answer:
                  "  Yes. We develop creative concepts aligned with your marketing strategy.",
              },
              {
                question: "Do you provide multiple versions of ads?",
                answer:
                  "Yes. We create variations for different formats and audiences.",
              },
              {
                question: "How do you ensure performance?",
                answer:
                  "We focus on storytelling, pacing, and platform optimization for maximum impact.",
              },
              
            ],
            ctaLabel: "View Digital Work",
            ctaHref: "/studio",
          },
           {
            id: 5,
            eyebrow: "Service 05",
            heroTitle: "AI PRODUCTION",
            heroTitleAccent: "Innovation.",
            heroDesc:
              "  We leverage AI to create next-generation visuals and content—pushing creative boundaries while increasing speed and efficiency.",
            heroVideo: "/videos/banner/s-5.webm",
            heroPoints: [
              "AI-generated visuals and videos",
              "Virtual production workflows",
              "AI-enhanced storytelling",
              "Faster content creation cycles",
              "Scalable creative solutions",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Process.",
            ritualTagline: "THREE PILLARS OF DIGITAL CRAFT",
            ritualSteps: [
              {
                num: "01",
                title: "Exploration",
                desc: " We identify opportunities where AI enhances creativity.",
              },
              {
                num: "02",
                title: "Creation",
                desc: "We generate and refine AI-driven content.",
              },
              {
                num: "03",
                title: "Integration",
                desc: " We blend AI with traditional production seamlessly.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "AI Visual Assets" },
              { label: "AI Video Content" },
              { label: "Creative Concepts" },
              { label: "Hybrid Production Outputs" },
              { label: "Scalable Content Library" },
              
            ],
            faq: [
              {
                question: "What kind of AI content do you create?",
                answer:
                  " We produce AI-generated visuals, videos, and hybrid creative assets.",
              },
              {
                question: "Is AI content customizable?",
                answer:
                  " Yes. Every output is tailored to your brand and creative needs.",
              },
              {
                question: "Can AI be combined with traditional production?",
                answer:
                  " Absolutely. We blend AI with live production for enhanced results.",
              },
              {
                question: "Is AI production faster than traditional methods?",
                answer:
                  " Yes. It significantly reduces production time while maintaining quality.",
              },
              
            ],
            ctaLabel: "View Digital Work",
            ctaHref: "/studio",
          },
           {
            id: 6,
            eyebrow: "Service 06",
            heroTitle: "ENTERTAINMENT EVENTS",
            heroTitleAccent: "Experience.",
            heroDesc:
              " We design and produce immersive entertainment experiences that engage audiences and create unforgettable moments.",
            heroVideo: "/videos/banner/s-6.webm",
            heroPoints: [
              "Event production and management",
              "Stage and show direction",
              "Live performances and experiences",
              "Hybrid and virtual events",
              "Audience-focused storytelling",
            ],
            accentColor: "#c8372d",
            ritualLabel: "The Process.",
            ritualTagline: "THREE PILLARS OF DIGITAL CRAFT",
            ritualSteps: [
              {
                num: "01",
                title: "Planning",
                desc: " We design the event experience and flow.",
              },
              {
                num: "02",
                title: "Execution",
                desc: " We manage production, stage, and live elements.",
              },
              {
                num: "03",
                title: "Experience",
                desc: "  We deliver seamless and impactful events.",
              },
            ],
            deliverablesTitle: "The\nDeliverables.",
            deliverables: [
              { label: "Event Concept & Plan" },
              { label: "Stage & Show Design" },
              { label: "Live Event Execution" },
              { label: "Digital/Hybrid Setup" },
              { label: "Post-event Media Assets" },
              
            ],
            faq: [
              {
                question: "Do you handle end-to-end event production?",
                answer:
                  " Yes. From concept to execution, we manage the entire experience.",
              },
              {
                question: "Can you produce large-scale events?",
                answer:
                  " Yes. We handle both small and large-scale productions.",
              },
              {
                question: "Do you support live streaming or hybrid events?",
                answer:
                  "Absolutely. We offer full digital and hybrid event solutions.",
              },
              {
                question: "Will you manage stage and technical setup?",
                answer:
                  "  Yes. We handle stage design, lighting, sound, and overall execution.",
              },
              
            ],
            ctaLabel: "View Digital Work",
            ctaHref: "/studio",
          },
        ]}
      />

      <Footer />
    </div>
  );
}