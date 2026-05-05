import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, ChevronLeft, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function ResetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !otp) {
      toast.error("Missing email or verification code. Please try the forgot password flow again.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setBusy(true);
    try {
      await api.resetPassword({
        email,
        otp,
        password: newPassword,
        confirmPassword: confirmPassword
      });
      setBusy(false);
      toast.success("Password reset successful. Please sign in.");
      setResetSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setBusy(false);
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
        {resetSuccess ? (
          <div className="text-center">
            <div className="mx-auto size-14 rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="size-7 text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight mb-2">Password reset successful</h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Your password has been reset. Redirecting to sign in...
            </p>
          </div>
        ) : (
          <>
            <Link
              to="/forgot"
              className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group w-fit"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
              Back to verification
            </Link>
            <h2 className="font-display text-3xl font-bold tracking-tight mb-2">Create new password</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Setting new password for <span className="font-medium text-foreground">{email}</span>
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Confirm new password"
                  className="w-full h-11 px-4 rounded-xl border border-input bg-background text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full h-11 mt-2 rounded-xl bg-primary text-primary-foreground font-medium shadow-glow hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {busy ? <Loader2 className="size-5 animate-spin" /> : "Reset Password"}
              </button>
            </form>
          </>
        )}
    </motion.div>
  );
}
