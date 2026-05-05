import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignUpPage } from "@/pages/auth/SignUpPage";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      throw redirect({ to: "/" });
    }
  },
  component: SignUpPage,
  head: () => ({
    meta: [
      { title: "Create Account — Storemo" },
      { name: "description", content: "Join Storemo to build and manage your mobile app." },
    ],
  }),
});
