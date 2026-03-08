import { Search, Brain, Video, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Real-Time Video Analysis",
    description: "Detects violent activity from live CCTV or uploaded videos.",
    color: "primary" as const,
  },
  {
    icon: Brain,
    title: "ResNet50 Feature Extraction",
    description: "Extracts high-level spatial features from video frames.",
    color: "primary" as const,
  },
  {
    icon: Video,
    title: "CNN Temporal Modeling",
    description: "Learns motion patterns across frame sequences.",
    color: "success" as const,
  },
  {
    icon: AlertTriangle,
    title: "Instant Alert System",
    description: "Generates alerts when violence is detected.",
    color: "alert" as const,
  },
];

const colorStyles = {
  primary: {
    iconBg: "bg-primary/10 group-hover:bg-primary/20",
    icon: "text-primary",
    border: "hover:border-primary/30",
    shadow: "hover:card-shadow-hover",
    gradient: "from-card to-primary/5",
  },
  success: {
    iconBg: "bg-success/10 group-hover:bg-success/20",
    icon: "text-success",
    border: "hover:border-success/30",
    shadow: "hover:card-shadow-hover-success",
    gradient: "from-card to-success/5",
  },
  alert: {
    iconBg: "bg-alert/10 group-hover:bg-alert/20",
    icon: "text-alert",
    border: "hover:border-alert/30",
    shadow: "hover:card-shadow-hover-alert",
    gradient: "from-card to-alert/5",
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-gradient-to-b from-secondary/50 to-muted/30 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Key Features</h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {features.map((feature) => {
            const style = colorStyles[feature.color];
            return (
              <div
                key={feature.title}
                className={`group rounded-xl border border-border bg-gradient-to-br ${style.gradient} p-6 card-shadow transition-all duration-300 hover:-translate-y-1.5 ${style.border} ${style.shadow}`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 ${style.iconBg}`}>
                  <feature.icon className={`h-6 w-6 ${style.icon}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
