import { notFound } from "next/navigation";
import {
  getAllServices,
  getAllServiceSlugs,
  getServiceBySlug,
} from "@/lib/data/services";
import ServiceDetailClient from "../../../component/ServiceDetailClient";

export const dynamic = "force-static";

const SITE_URL = "https://21fiftyone.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  const title = service.heroTitle;
  const description = service.heroDesc.trim();
  const canonical = `${SITE_URL}/services/${service.slug}`;

  return {
    title: `${title} | 21FiftyOne Studio`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const allServices = getAllServices();

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} allServices={allServices} />;
}