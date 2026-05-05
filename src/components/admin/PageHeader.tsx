import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-display font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
      className={cn("rounded-2xl bg-card border border-border shadow-soft", className)}
    >
      {children}
    </motion.div>
  );
}

export function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "success" | "warning" | "destructive" | "primary" }) {
  return (
    <span className={cn(
      "inline-flex text-xs px-2 py-0.5 rounded-md font-medium capitalize",
      tone === "default" && "bg-muted text-muted-foreground",
      tone === "success" && "bg-success/10 text-success",
      tone === "warning" && "bg-warning/15 text-warning",
      tone === "destructive" && "bg-destructive/10 text-destructive",
      tone === "primary" && "bg-primary/10 text-primary",
    )}>{children}</span>
  );
}
