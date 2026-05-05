import { createFileRoute, redirect } from "@tanstack/react-router";
import { ForgotPage } from "@/pages/auth/ForgotPage";

export const Route = createFileRoute("/forgot")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      throw redirect({ to: "/" });
    }
  },
  component: ForgotPage,
  head: () => ({
    meta: [
      { title: "Forgot Password — Storemo" },
      { name: "description", content: "Reset your Storemo account password." },
    ],
  }),
});
