import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AuthLayout, AuthInput } from "./AuthLayout";

export function ForgotPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.forgotPassword(email);
      setBusy(false);
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (error) {
      setBusy(false);
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.verifyOtp(email, otp);
      setBusy(false);
      toast.success("OTP verified successfully");
      // Redirect to reset page with email and otp
      navigate({
        to: "/reset",
        search: { email, otp } as any
      });
    } catch (error) {
      setBusy(false);
      toast.error(error instanceof Error ? error.message : "Invalid OTP");
    }
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={() => step === "otp" ? setStep("email") : navigate({ to: "/login" })}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group w-fit"
          >
            <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {step === "email" ? (
            <>
              <h2 className="font-display text-3xl font-bold tracking-tight mb-2">Reset password</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              <form onSubmit={sendOtp} className="space-y-4">
                <AuthInput
                  label="Email address"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  required
                  autoFocus
                  placeholder="name@company.com"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 mt-2 rounded-xl bg-primary text-primary-foreground font-medium shadow-glow hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {busy ? <Loader2 className="size-5 animate-spin" /> : "Send OTP"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <ShieldCheck className="size-7 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight mb-2">Verify OTP</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>.
              </p>
              <form onSubmit={verifyOtp} className="space-y-4">
                <AuthInput
                  label="Verification Code"
                  value={otp}
                  onChange={setOtp}
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter 6-digit OTP"
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full h-11 mt-2 rounded-xl bg-primary text-primary-foreground font-medium shadow-glow hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {busy ? <Loader2 className="size-5 animate-spin" /> : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  className="w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              </form>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
}
