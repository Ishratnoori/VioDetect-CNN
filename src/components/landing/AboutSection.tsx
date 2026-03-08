import { ShieldCheck } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>About VioDetect</h2>
          <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-card to-secondary/30 p-8 card-shadow transition-all duration-300 hover:border-primary/30 hover:card-shadow-hover hover:-translate-y-1">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              VioDetect is designed to enhance public safety by automatically detecting violent behavior in surveillance videos. The system analyzes spatial features using <strong className="text-foreground font-semibold">ResNet50</strong> and learns through frames using the  <strong className="text-foreground font-semibold">CNN</strong> to classify activities as violent or non-violent in real time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
