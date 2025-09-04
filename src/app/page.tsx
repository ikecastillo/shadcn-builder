"use client";

import { BlocksIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Hero from "@/components/landingpage/hero";
import FeatureSteps from "@/components/landingpage/featureSteps";
import Templates from "@/components/landingpage/templates";
import Header from "@/components/landingpage/header";
import Footer from "@/components/landingpage/footer";
import TestimonialsCarousel from "@/components/landingpage/testimonials";

export default function FormBuilderPage() {
  return (
    <div>
      <Header />
      <main className="flex flex-col items-center mt-24 gap-36">
        <Hero />
        <FeatureSteps />
        <Templates />
        <TestimonialsCarousel />
      </main>
      <Footer />
    </div>
  );
}
