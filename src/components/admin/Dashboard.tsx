import { motion } from "framer-motion";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from "recharts";
import {
  DollarSign, ShoppingCart, TrendingUp, Users, ArrowUpRight, Sparkles, MoreHorizontal
} from "lucide-react";
import { StatCard } from "./StatCard";
import { aiInsights, funnelData, recentOrders, revenueData, topProducts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/15 text-warning",
  refunded: "bg-destructive/10 text-destructive",
  fulfilled: "bg-chart-2/10 text-chart-2",
};

export function Dashboard() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">Good morning, Alex</h1>
          <p className="text-muted-foreground mt-1.5">Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d", "12m"].map((p, i) => (
            <button key={p} className={cn(
              "px-3 py-1.5 text-sm rounded-md border transition",
              i === 1 ? "bg-foreground text-background border-foreground" : "border-border hover:bg-muted"
            )}>{p}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Revenue" value="$112,840" delta={18.2} icon={DollarSign} accent="primary" index={0} />
        <StatCard label="Orders" value="1,392" delta={12.4} icon={ShoppingCart} accent="chart-2" index={1} />
        <StatCard label="Conversion" value="5.04%" delta={2.1} icon={TrendingUp} accent="chart-3" index={2} />
        <StatCard label="New Customers" value="284" delta={-1.8} icon={Users} accent="chart-4" index={3} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-soft p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg">Revenue overview</h3>
              <p className="text-sm text-muted-foreground">Last 12 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-chart-2" />Orders</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rev)" />
                <Area type="monotone" dataKey="orders" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#ord)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg">Conversion funnel</h3>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          <div className="space-y-3">
            {funnelData.map((s, i) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{s.stage}</span>
                  <span className="text-muted-foreground tabular-nums">{s.value.toLocaleString()} • {s.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Recent orders</h3>
              <p className="text-sm text-muted-foreground">Real-time activity</p>
            </div>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowUpRight className="size-3.5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground border-y border-border bg-muted/30">
                <tr>
                  <th className="text-left font-medium px-6 py-2.5">Order</th>
                  <th className="text-left font-medium px-3 py-2.5">Customer</th>
                  <th className="text-left font-medium px-3 py-2.5">Status</th>
                  <th className="text-right font-medium px-3 py-2.5">Total</th>
                  <th className="text-right font-medium px-6 py-2.5">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                    <td className="px-6 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium">{o.customer}</div>
                      <div className="text-xs text-muted-foreground">{o.email}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("text-xs px-2 py-0.5 rounded-md font-medium capitalize", statusStyles[o.status])}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium">${o.total.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg">Top products</h3>
              <p className="text-sm text-muted-foreground">By revenue</p>
            </div>
            <button className="grid place-items-center size-7 rounded-md hover:bg-muted text-muted-foreground">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
          <ul className="space-y-3">
            {topProducts.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-gradient-primary/15 grid place-items-center text-primary font-semibold text-xs">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sales} sold</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">${(p.revenue / 1000).toFixed(1)}k</div>
                  <div className={cn("text-xs", p.trend >= 0 ? "text-success" : "text-destructive")}>
                    {p.trend >= 0 ? "+" : ""}{p.trend}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* AI Insights + sales bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl bg-card border border-border shadow-soft p-6"
        >
          <h3 className="font-display font-semibold text-lg mb-4">Sales by month</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{
                  background: "var(--color-popover)", border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem", fontSize: "12px",
                }} />
                <Bar dataKey="orders" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card to-primary/5 shadow-soft p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-lg">AI Insights</h3>
            </div>
            <ul className="space-y-3">
              {aiInsights.map((insight, i) => (
                <li key={i} className="p-3 rounded-lg bg-background/50 border border-border">
                  <div className="text-sm font-semibold mb-0.5">{insight.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{insight.body}</div>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
