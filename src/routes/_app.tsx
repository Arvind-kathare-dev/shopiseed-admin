import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/admin/AppShell";

export const Route = createFileRoute("/_app")({
  component: () => <AppShell />,
});
