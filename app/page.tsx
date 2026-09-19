import { ClimateReality } from "@/components/ClimateSections";
import { Encourage } from "@/components/Encourage";
import { EvaluationSection } from "@/components/Evaluation";
import { Footer } from "@/components/Footer";
import { Glossary } from "@/components/Glossary";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Idea } from "@/components/Idea";
import { Problem } from "@/components/Problem";
import { School } from "@/components/School";
import { Team } from "@/components/Team";
import { Tools } from "@/components/Tools";
import { TrustStrip } from "@/components/TrustStrip";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <Idea />
        <HowItWorks />
        <Tools />
        <ClimateReality />
        <Glossary />
        <School />
        <Team />
        <EvaluationSection />
        <Encourage />
      </main>
      <Footer />
    </>
  );
}
