import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Upload, Radar, Cpu, Siren } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200">
              <Shield className="h-4 w-4 text-primary" />
              AI Surveillance Console
              <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary animate-pulse-soft">
                LIVE
              </span>
            </div>

            <h1
              className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
               VioDetect {" "}
              <span className="text-gradient-primary"> : Smart Security Monitoring System</span>{" "}
              
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
              Monitor live webcam feeds and analyze uploaded footage with a ResNet50-based CNN.
              Get instant threat classification, confidence scores, and category alerts in a modern
              cyber-security dashboard.
            </p>

            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-xl px-8"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-white/10 bg-white/5 px-8 text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  <Upload className="mr-2 h-4 w-4 text-primary" />
                  Upload Video
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 rounded-[40px] bg-primary/10 blur-3xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard glow className="p-5 animate-float">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Threat Monitor
                    </div>
                    <div className="mt-1 text-lg font-bold text-foreground">Real-time detection</div>
                    <div className="mt-2 text-sm text-slate-300">
                      Continuous frame inference with status overlays.
                    </div>
                  </div>
                  <div className="rounded-xl bg-primary/15 p-3 text-primary neon-ring">
                    <Radar className="h-5 w-5" />
                  </div>
                </div>
              </GlassCard>

              <GlassCard glow className="p-5 animate-float [animation-delay:800ms]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Model Core
                    </div>
                    <div className="mt-1 text-lg font-bold text-foreground">ResNet50 + CNN</div>
                    <div className="mt-2 text-sm text-slate-300">
                      Crime-category classification across 14 classes.
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 text-primary neon-ring">
                    <Cpu className="h-5 w-5" />
                  </div>
                </div>
              </GlassCard>

              <GlassCard glow className="p-5 sm:col-span-2 animate-float [animation-delay:400ms]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Alert System
                    </div>
                    <div className="mt-1 text-lg font-bold text-foreground">
                      Instant incident escalation
                    </div>
                    <div className="mt-2 text-sm text-slate-300">
                      Large threat banners + confidence score to reduce false alarms.
                    </div>
                  </div>
                  <div className="rounded-xl bg-red-500/10 p-3 text-red-200">
                    <Siren className="h-5 w-5 text-red-300" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
