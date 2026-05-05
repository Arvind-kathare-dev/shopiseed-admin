import { Bell, Menu, Moon, Search, Sun, Plus } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/lib/store";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();
  const { pathname: path } = useLocation();
  const crumbs = path === "/" ? ["Dashboard"] : path.split("/").filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1));
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout: signOut } = useAuthStore();
  const navigate = useNavigate();
  const email = user?.email ?? "guest@storemo.app";
  const fullName = user?.name || (user?.user_metadata?.full_name as string | undefined) || email.split("@")[0];
  const initials = fullName.split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();

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
            {initials}
          </div>
          <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">{fullName}</span>
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
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-card/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border/50 z-50 overflow-hidden"
              >
                <div className="p-4 bg-muted/30 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-sm font-bold shadow-glow">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate text-foreground">{fullName}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{email}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      Owner
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20">
                      Active
                    </span>
                  </div>
                </div>
                <div className="p-2 space-y-0.5 text-sm">
                  <button onClick={() => { setProfileOpen(false); navigate("/settings"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                    Profile
                  </button>
                  <button onClick={() => { setProfileOpen(false); navigate("/settings"); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                    Account settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground">
                    Billing
                  </button>
                  <div className="h-px bg-border/50 my-1 mx-2" />
                  <button
                    onClick={async () => { await signOut(); navigate("/login"); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
