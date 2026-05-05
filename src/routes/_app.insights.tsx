import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { aiInsights } from "@/lib/mock-data";
import { Sparkles, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/insights")({
  component: InsightsPage,
});

const tones = {
  warning: { icon: AlertTriangle, color: "text-warning bg-warning/10" },
  primary: { icon: TrendingUp, color: "text-primary bg-primary/10" },
  destructive: { icon: AlertTriangle, color: "text-destructive bg-destructive/10" },
} as const;

function InsightsPage() {
  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <PageHeader title="AI Insights" subtitle="Predictive intelligence powered by your store data" />

      <Card className="p-8 relative overflow-hidden border-primary/30">
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="relative flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Sparkles className="size-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-xl">Platform on track for ₹14.2L revenue this month</h2>
            <p className="text-sm text-muted-foreground mt-1">Projected 22% above last month based on new client onboardings and renewal trends.</p>
          </div>
          <button className="hidden sm:flex px-4 h-10 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">
            Get full report
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((i, idx) => {
          const t = tones[i.tone as keyof typeof tones];
          return (
            <Card key={idx} className="p-5">
              <div className={cn("size-10 rounded-lg grid place-items-center mb-3", t.color)}>
                <t.icon className="size-5" />
              </div>
              <div className="font-semibold mb-1">{i.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{i.body}</div>
              <button className="mt-4 text-sm text-primary hover:underline">Take action →</button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="size-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">Recommended next actions</h3>
        </div>
        <ul className="space-y-3">
          {[
            "Schedule proactive check-in call with Lumina Beauty — 14 days inactive before renewal",
            "Launch bundle campaign: Growth Plan + AI Add-on offer to 380 eligible clients (est. ₹23.8L)",
            "A/B test push notification copy for Thread & Co — open rate dropped to 18%",
            "Onboard 2 remaining May slots — 2 of 4 spots still open for this month",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
              <div className="size-6 rounded-full bg-primary/10 text-primary text-xs font-semibold grid place-items-center shrink-0">{i+1}</div>
              <div className="text-sm flex-1">{item}</div>
              <button className="text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
