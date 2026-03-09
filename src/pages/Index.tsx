import { AppBackground } from "@/components/layout/AppBackground";
import { TopNav } from "@/components/layout/TopNav";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CrimeTypesSection from "@/components/landing/CrimeTypesSection";
import TechStackSection from "@/components/landing/TechStackSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <AppBackground>
      <TopNav variant="landing" />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CrimeTypesSection />
      <TechStackSection />
      <Footer />
    </AppBackground>
  );
};

export default Index;
