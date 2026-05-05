import { useState, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthLayout, GoogleIcon, AuthInput } from "./AuthLayout";

export function LoginPage() {
  const { user, signIn, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await signIn(email, password);
    setBusy(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Login successful. Redirecting to dashboard…");
      setTimeout(() => navigate({ to: "/" }), 1500);
    }
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
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-display text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your credentials to access your account.
        </p>

        <button
          onClick={google}
          disabled={busy}
          className="w-full h-11 rounded-xl border border-input bg-card hover:bg-accent/50 text-sm font-medium flex items-center justify-center gap-3 transition-colors disabled:opacity-50"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with</span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <AuthInput label="Email address" value={email} onChange={setEmail} type="email" required />
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-11 px-4 pr-11 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <div className="flex justify-end pt-0.5">
              <Link
                to="/forgot"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 mt-2 rounded-xl bg-primary text-primary-foreground font-medium shadow-glow hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none group"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
