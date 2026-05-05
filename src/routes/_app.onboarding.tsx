import { createFileRoute } from "@tanstack/react-router";
import { OnboardingPage } from "@/pages/admin/OnboardingPage";

export const Route = createFileRoute("/_app/onboarding")({
  component: OnboardingPage,
});
