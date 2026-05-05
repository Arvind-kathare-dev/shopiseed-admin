import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Loom" },
      { name: "description", content: "Sign in to your Loom commerce admin." },
    ],
  }),
});

function LoginPage() {
  const { user, signIn, signUp, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password, name);
    setBusy(false);
    if (res.error) toast.error(res.error);
    else if (mode === "signup") toast.success("Account created. Redirecting…");
  };

  const google = async () => {
    setBusy(true);
    const res = await signInWithGoogle();
    if (res.error) {
      setBusy(false);
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-primary p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-glow opacity-60" />
        <div className="relative flex items-center gap-3 text-primary-foreground">
          <div className="size-10 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
            <Store className="size-5" />
          </div>
          <div className="font-display text-xl font-semibold">Loom</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-primary-foreground"
        >
          <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight text-balance">
            Run your D2C store with clarity.
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Real-time analytics, AI-powered insights, and a beautiful admin built for modern commerce.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              ["12k+", "Stores"],
              ["$48M", "GMV / mo"],
              ["4.9★", "Rating"],
            ].map(([k, v]) => (
              <div key={v} className="rounded-xl bg-white/10 backdrop-blur p-3">
                <div className="font-display text-xl font-bold">{k}</div>
                <div className="text-xs text-primary-foreground/70">{v}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className="relative text-xs text-primary-foreground/60">© 2026 Loom Commerce</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Store className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-lg">Loom</span>
          </div>
          <h2 className="font-display text-2xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to your admin dashboard." : "Start managing your store in minutes."}
          </p>

          <button
            onClick={google}
            disabled={busy}
            className="mt-6 w-full h-10 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> OR <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <Input label="Full name" value={name} onChange={setName} type="text" required />
            )}
            <Input label="Email" value={email} onChange={setEmail} type="email" required />
            <Input label="Password" value={password} onChange={setPassword} type="password" required minLength={6} />
            <button
              type="submit"
              disabled={busy}
              className="w-full h-10 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-muted-foreground">
            {mode === "signin" ? "New to Loom?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(m => m === "signin" ? "signup" : "signin")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </div>
          <div className="mt-3 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">Back to home</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type, required, minLength }: {
  label: string; value: string; onChange: (v: string) => void; type: string; required?: boolean; minLength?: number;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5 text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring/50 transition"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
