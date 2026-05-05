import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

interface AuthLayoutProps {
  backToLabel?: string;
  backToHref?: string;
}

export function AuthLayout({ backToLabel = "Back to website", backToHref = "/" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Left Column: Branding / Graphics */}
      <div className="hidden lg:flex w-[45%] relative overflow-hidden bg-zinc-950 flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/30 to-transparent opacity-50" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/40 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-12 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="size-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 grid place-items-center shadow-[0_0_15px_rgba(142,108,239,0.3)]">
            <Store className="size-5 text-white" />
          </div>
          <div className="font-display text-2xl font-bold tracking-tight">Storemo</div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative z-10 text-white"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur text-sm font-medium mb-6 text-white/90">
            <span className="flex size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(142,108,239,0.8)]"></span>
            Storemo 3.0 is live
          </div>
          <h1 className="font-display text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
            Turn mobile traffic into revenue.
          </h1>
          <p className="mt-6 text-white/70 max-w-md text-lg leading-relaxed">
            Native Flutter apps, 14 built-in CRO features, and push notifications — all connected to your Shopify store.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 max-w-md">
            {[
              { label: "Active Stores", value: "12,000+" },
              { label: "Processed GMV", value: "$2.4B" },
              { label: "Uptime", value: "99.99%" },
              { label: "Customer Rating", value: "4.9/5" },
            ].map((stat) => (
              <div key={stat.label} className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 hover:bg-white/10 transition-colors">
                <div className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">{stat.value}</div>
                <div className="text-sm text-white/60 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center justify-between text-sm font-medium text-white/50">
          <span>© 2026 Storemo. Ahmedabad, India.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
          <Link to={backToHref as any} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {backToLabel}
          </Link>
        </div>

        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Store className="size-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Storemo</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function AuthInput({ label, value, onChange, type, required, autoFocus, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type: string; required?: boolean; autoFocus?: boolean; placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
      />
    </div>
  );
}
