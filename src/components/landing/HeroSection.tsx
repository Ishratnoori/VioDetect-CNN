import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Upload } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary to-success/4" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-success/5 blur-3xl" />

      <div className="container relative mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Smart Surveillance System
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI-Powered Real-Time{" "}
            <span className="text-gradient-primary">Violence Detection</span>{" "}
            System
          </h1>
          <p className="mb-10 text-lg text-muted-foreground md:text-xl leading-relaxed">
            VioDetect is a deep learning-based smart surveillance platform that automatically detects violent activities from CCTV footage and uploaded videos.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 px-8 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="gap-2 px-8 border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all">
                <Upload className="h-4 w-4" />
                Upload Video
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
