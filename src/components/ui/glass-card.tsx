import * as React from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function GlassCard({ className, glow = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass card-shadow relative rounded-2xl p-6",
        glow && "neon-ring",
        className
      )}
      {...props}
    />
  );
}

