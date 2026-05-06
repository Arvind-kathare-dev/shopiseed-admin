import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Settings, Sparkles, Tag, ChevronLeft, Store, ClipboardList,
  UserCheck
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/onboarding", label: "Onboarding Leads", icon: ClipboardList },
  { to: "/users", label: "Users", icon: Users },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/customers", label: "Customers", icon: UserCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/campaigns", label: "Campaigns", icon: Tag },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname: path } = useLocation();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen shrink-0",
          "border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
          "flex flex-col",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow shrink-0">
              <Store className="size-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="font-display font-semibold">Storemo</div>
                <div className="text-[11px] text-muted-foreground">Mobile App Builder</div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:grid place-items-center size-7 rounded-md hover:bg-sidebar-accent text-muted-foreground"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          <ul className="space-y-1">
            {nav.map(item => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                      />
                    )}
                    <item.icon className="size-[18px] shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="m-3 p-4 rounded-xl bg-gradient-primary/10 border border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
            <Sparkles className="size-5 text-primary mb-2" />
            <div className="text-sm font-semibold">Upgrade to Pro</div>
            <div className="text-xs text-muted-foreground mt-1">Unlock AI push campaigns & advanced CRO analytics.</div>
            <button className="mt-3 w-full text-xs font-medium px-3 py-1.5 rounded-md bg-gradient-primary text-primary-foreground shadow-glow">
              Upgrade
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}
