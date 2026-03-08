const categories = [
  {
    title: "Frontend",
    items: ["ReactJS", "Tailwind CSS"],
    accent: "primary" as const,
  },
  {
    title: "Backend",
    items: ["Flask (Python)", "REST APIs", "OpenCV"],
    accent: "primary" as const,
  },
  {
    title: "Deep Learning",
    items: ["ResNet50", "TensorFlow / PyTorch", "Kaggle GPU Training"],
    accent: "success" as const,
  },
  {
    title: "Dataset",
    items: ["UCF-Crime Dataset"],
    accent: "alert" as const,
  },
];

const accentStyles = {
  primary: "text-primary border-l-primary/40 group-hover:border-primary/30",
  success: "text-success border-l-success/40 group-hover:border-success/30",
  alert: "text-alert border-l-alert/40 group-hover:border-alert/30",
};

const shadowStyles = {
  primary: "hover:card-shadow-hover",
  success: "hover:card-shadow-hover-success",
  alert: "hover:card-shadow-hover-alert",
};

const TechStackSection = () => {
  return (
    <section id="tech" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Technology Stack</h2>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <div key={cat.title} className={`group rounded-xl border border-border border-l-4 ${accentStyles[cat.accent]} bg-card p-6 card-shadow transition-all duration-300 hover:-translate-y-1 ${shadowStyles[cat.accent]}`}>
              <h3 className={`mb-3 text-sm font-semibold uppercase tracking-wider ${accentStyles[cat.accent].split(' ')[0]}`}>{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
