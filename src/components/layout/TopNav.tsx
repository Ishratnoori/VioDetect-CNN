import { Link, NavLink } from "react-router-dom";
import { Shield, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TopNavProps = {
  variant?: "landing" | "dashboard";
};

const links = [
  { label: "About", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Tech Stack", href: "/#tech" },
  { label: "Dashboard", href: "/dashboard" },
];

export function TopNav({ variant = "landing" }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/35 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary neon-ring">
            <Shield className="h-5 w-5" />
          </span>
          <span
            className="text-lg font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VioDetect
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) =>
            l.href.startsWith("/#") ? (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-slate-300/90 transition-colors hover:text-primary"
              >
                {l.label}
              </a>
            ) : (
              <NavLink
                key={l.label}
                to={l.href}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium text-slate-300/90 transition-colors hover:text-primary",
                    isActive && "text-primary"
                  )
                }
              >
                {l.label}
              </NavLink>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {variant === "dashboard" ? (
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
              >
                Back to Landing
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

