import type { Metadata } from "next";

import { getAllServices } from "@/lib/data/services";
import ServicesListClient from "../../component/ServicesListClient";

export const metadata: Metadata = {
  title: "Video Production Services in Kozhikode | 21FiftyOne",
  description:
    "Explore 21FiftyOne's video production services, including visual production, movie production, corporate films, commercials, AI production and events.",
  alternates: {
    canonical: "https://21fiftyone.com/services",
  },
  openGraph: {
    title: "Video Production Services in Kozhikode | 21FiftyOne",
    description:
      "Explore 21FiftyOne's video production services, including visual production, movie production, corporate films, commercials, AI production and events.",
    url: "https://21fiftyone.com/services",
    siteName: "21FiftyOne",
    type: "website",
  },
};

export default function ServicesPage() {
  const services = getAllServices();
  return <ServicesListClient services={services} />;
}