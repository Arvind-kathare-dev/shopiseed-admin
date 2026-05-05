import { Bell, Menu, Moon, Search, Sun, Plus } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();
  const path = useRouterState({ select: s => s.location.pathname });
  const crumbs = path === "/" ? ["Dashboard"] : path.split("/").filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1));
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-border flex items-center gap-3 px-4 lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden grid place-items-center size-9 rounded-md hover:bg-muted">
        <Menu className="size-5" />
      </button>

      <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-muted/60 border border-border w-72">
        <Search className="size-4 text-muted-foreground" />
        <input
          placeholder="Search products, orders, customers…"
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
        />
        <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground">⌘K</kbd>
      </div>

      <button className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition">
        <Plus className="size-4" /> New
      </button>

      <button onClick={toggle} className="grid place-items-center size-9 rounded-md hover:bg-muted">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <button className="relative grid place-items-center size-9 rounded-md hover:bg-muted">
        <Bell className="size-4" />
        <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
      </button>

      <div className="relative">
        <button
          onClick={() => setProfileOpen(o => !o)}
          className="flex items-center gap-2 pl-1 pr-2 h-9 rounded-full hover:bg-muted"
        >
          <div className="size-7 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
            AR
          </div>
          <span className="hidden sm:inline text-sm font-medium">Alex R.</span>
        </button>
        <AnimatePresence>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 rounded-xl glass shadow-elegant border border-border z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <div className="font-semibold text-sm">Alex Rivera</div>
                  <div className="text-xs text-muted-foreground">alex@loom.shop</div>
                  <span className="inline-block mt-2 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-accent text-accent-foreground">Owner</span>
                </div>
                <div className="p-1.5 text-sm">
                  {["Profile", "Account settings", "Billing", "Sign out"].map(i => (
                    <button key={i} className="w-full text-left px-3 py-2 rounded-md hover:bg-muted">{i}</button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
