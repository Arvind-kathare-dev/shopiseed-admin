import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/admin/AppShell";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    // Check auth token in local storage
    if (typeof window !== "undefined") {
      const isAuth = !!localStorage.getItem("auth_token");
      if (!isAuth) throw redirect({ to: "/login" });
    }
  },
  component: () => <AppShell />,
});
