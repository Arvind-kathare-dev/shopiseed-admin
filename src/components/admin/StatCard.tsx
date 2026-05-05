import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, delta, icon: Icon, accent = "primary", index = 0,
}: {
  label: string; value: string; delta: number; icon: LucideIcon;
  accent?: "primary" | "chart-2" | "chart-3" | "chart-4"; index?: number;
}) {
  const up = delta >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative rounded-2xl p-5 bg-card border border-border shadow-soft overflow-hidden group"
    >
      <div className={cn("absolute -top-12 -right-12 size-32 rounded-full opacity-20 blur-2xl",
        accent === "primary" && "bg-primary",
        accent === "chart-2" && "bg-chart-2",
        accent === "chart-3" && "bg-chart-3",
        accent === "chart-4" && "bg-chart-4",
      )} />
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={cn("size-9 rounded-lg grid place-items-center",
          accent === "primary" && "bg-primary/10 text-primary",
          accent === "chart-2" && "bg-chart-2/10 text-chart-2",
          accent === "chart-3" && "bg-chart-3/10 text-chart-3",
          accent === "chart-4" && "bg-chart-4/10 text-chart-4",
        )}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="text-3xl font-display font-semibold tracking-tight">{value}</div>
      <div className="mt-2 flex items-center gap-1.5 text-xs">
        <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-medium",
          up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {Math.abs(delta)}%
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </motion.div>
  );
}
