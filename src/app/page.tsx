import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { TradeLanes } from "@/components/sections/TradeLanes";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";
import { Network } from "@/components/sections/Network";
import { Process } from "@/components/sections/Process";
import { Infrastructure } from "@/components/sections/Infrastructure";
import { Showreel } from "@/components/sections/Showreel";
import { Industries } from "@/components/sections/Industries";
import { Testimonials } from "@/components/sections/Testimonials";
import { Insights } from "@/components/sections/Insights";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Home page section order is a deliberate rhythm, not a list:
 *   cinematic → kinetic → still → interactive → data → dimensional →
 *   procedural → photographic → cinematic → grid → colour shift → light.
 * No two adjacent sections share a background treatment or an interaction model.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TradeLanes />
      <Manifesto />
      <Services />
      <Stats />
      <Network />
      <Process />
      <Infrastructure />
      <Showreel />
      <Industries />
      <Testimonials />
      <Insights />
    </>
  );
}
