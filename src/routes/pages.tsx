import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/pages")({
  component: PagesLayout,
});

function PagesLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
