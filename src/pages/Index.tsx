import { Link } from "react-router-dom";
import { Shield, Search, Brain, Video, AlertTriangle, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/landing/HeroSection";
import AboutSection from "@/components/landing/AboutSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CrimeTypesSection from "@/components/landing/CrimeTypesSection";
import TechStackSection from "@/components/landing/TechStackSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VioDetect</span>
          </div>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#about" className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">About</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">How It Works</a>
            <a href="#tech" className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">Tech Stack</a>
          </div>
          <Link to="/dashboard">
            <Button size="sm" className="shadow-md shadow-primary/15">Dashboard</Button>
          </Link>
        </div>
      </nav>

      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CrimeTypesSection />
      <TechStackSection />
      <Footer />
    </div>
  );
};

export default Index;
