import { getAllServices } from "@/lib/data/services";
import ServicesListClient from "../../component/ServicesListClient";

export const metadata = {
  title: "Services | 21FiftyOne Studio",
  description:
    "Visual production, film, corporate content, commercials, AI production, and live events — engineered with precision.",
};

export default function ServicesPage() {
  const services = getAllServices();
  return <ServicesListClient services={services} />;
}