const crimeTypes = [
  "Abuse", "Arrest", "Arson", "Assault", "Burglary", "Explosion",
  "Fighting", "Road Accidents", "Robbery", "Shooting", "Shoplifting",
  "Stealing", "Vandalism",
];

const CrimeTypesSection = () => {
  return (
    <section className="bg-gradient-to-b from-secondary/50 to-muted/30 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Detected Crime Types</h2>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {crimeTypes.map((type) => (
            <div
              key={type}
              className="rounded-xl border border-alert/10 bg-gradient-to-br from-card to-alert/3 px-4 py-3 text-center text-sm font-medium text-foreground card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:border-alert/30 hover:card-shadow-hover-alert hover:text-alert"
            >
              {type}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Categories derived from the UCF-Crime dataset used for model training and evaluation.
        </p>
      </div>
    </section>
  );
};

export default CrimeTypesSection;
