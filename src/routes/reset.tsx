import { createFileRoute, redirect } from "@tanstack/react-router";
import { ResetPage } from "@/pages/auth/ResetPage";
import { z } from "zod";

const resetSearchSchema = z.object({
  email: z.string().optional().catch(""),
  otp: z.string().optional().catch(""),
});

export const Route = createFileRoute("/reset")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("auth_token")) {
      throw redirect({ to: "/" });
    }
  },
  component: ResetPage,
  validateSearch: (search) => resetSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "New Password — Storemo" },
      { name: "description", content: "Create a new password for your Storemo account." },
    ],
  }),
});
