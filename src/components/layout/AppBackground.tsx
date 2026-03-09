import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AppBackgroundProps = {
  className?: string;
  children: ReactNode;
};

export function AppBackground({ className, children }: AppBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen hero-gradient text-foreground", className)}>
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-80" />
      <div className="relative">{children}</div>
    </div>
  );
}

