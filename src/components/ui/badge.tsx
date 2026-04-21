import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "info";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span className={cn("badge", `badge-${tone}`)}>
      {children}
    </span>
  );
}
