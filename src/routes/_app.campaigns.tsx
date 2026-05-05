import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { Plus, Tag } from "lucide-react";

export const Route = createFileRoute("/_app/campaigns")({
  component: CampaignsPage,
});

const campaigns = [
  { name: "Summer Sale 2025", code: "SUMMER25", discount: "25% off", uses: 1240, status: "active", revenue: 48200 },
  { name: "First-time buyer", code: "WELCOME10", discount: "$10 off", uses: 3120, status: "active", revenue: 92400 },
  { name: "Black Friday VIP", code: "BFVIP", discount: "40% off", uses: 0, status: "scheduled", revenue: 0 },
  { name: "Free shipping", code: "FREESHIP", discount: "Shipping", uses: 5420, status: "active", revenue: 184000 },
  { name: "Spring clearance", code: "SPRING", discount: "30% off", uses: 890, status: "ended", revenue: 24800 },
];

function CampaignsPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Campaigns & Coupons"
        subtitle="Run promotions and track performance"
        action={
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">
            <Plus className="size-4" /> New campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {campaigns.map(c => (
          <Card key={c.code} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <Tag className="size-5" />
              </div>
              <Pill tone={c.status === "active" ? "success" : c.status === "scheduled" ? "warning" : "default"}>{c.status}</Pill>
            </div>
            <div className="font-semibold">{c.name}</div>
            <div className="font-mono text-xs text-muted-foreground mt-0.5">{c.code} · {c.discount}</div>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Uses</div>
                <div className="text-lg font-semibold tabular-nums">{c.uses.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</div>
                <div className="text-lg font-semibold tabular-nums">${(c.revenue/1000).toFixed(1)}k</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
