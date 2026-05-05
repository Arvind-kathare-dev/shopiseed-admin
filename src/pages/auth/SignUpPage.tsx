import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthInput } from "./AuthLayout";

export function SignUpPage() {
  const { user, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await signUp(email, password, name);
    setBusy(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Account created. Redirecting to dashboard…");
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-display text-3xl font-bold tracking-tight mb-2">Create an account</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Enter your details to start managing your store.
      </p>



      <form onSubmit={submit} className="space-y-4">
        <AuthInput label="Full name" value={name} onChange={setName} type="text" required />
        <AuthInput label="Email address" value={email} onChange={setEmail} type="email" required />
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground block">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
          />
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
              Create account
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </motion.div>
  );
}
