import { Camera, Layers, Cpu, Bell, ChevronRight } from "lucide-react";

const steps = [
  { icon: Camera, label: "Capture Video", sub: "CCTV / Upload" },
  { icon: Layers, label: "Extract & Preprocess", sub: "Frame Processing" },
  { icon: Cpu, label: "Analyze", sub: "ResNet50(cnn frames) " },
  { icon: Bell, label: "Classify & Alert", sub: "Generate Report" },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>How It Works</h2>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="group flex flex-col items-center text-center">
                  <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 transition-all duration-300 group-hover:from-primary/25 group-hover:to-primary/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/15">
                    <step.icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.sub}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden h-5 w-5 text-primary/40 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
