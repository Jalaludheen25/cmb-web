import { Hero } from "@/components/sections/Hero";
import { TradeLanes } from "@/components/sections/TradeLanes";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Network } from "@/components/sections/Network";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TradeLanes />
      <Manifesto />
      <Services />
      <Network />
    </>
  );
}
