import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/cn";

export function AppShell({
  children,
  flush = false,
  overlayHeader = false,
}: {
  children: ReactNode;
  flush?: boolean;
  overlayHeader?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <SiteHeader overlay={overlayHeader} />
      <div className={cn("flex min-h-0 flex-1 flex-col", flush && "overflow-hidden")}>
        {children}
      </div>
    </div>
  );
}
