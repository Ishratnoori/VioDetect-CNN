import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-card to-secondary/30 py-10">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>VioDetect</span>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">
          VioDetect Smart Security Monitoring System
        </p>
        <p className="text-xs text-muted-foreground">
              2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
