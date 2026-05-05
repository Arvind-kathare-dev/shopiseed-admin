import { createFileRoute } from "@tanstack/react-router";
import { Card, PageHeader } from "@/components/admin/PageHeader";
import { useTheme } from "@/lib/theme";
import { useBrand, BRAND_COLORS } from "@/lib/brand";
import { Check, Moon, Store, CreditCard, Truck, Receipt, User, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

const sections = [
  { id: "store", label: "Store", icon: Store },
  { id: "profile", label: "Profile", icon: User },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "tax", label: "Tax", icon: Receipt },
  { id: "appearance", label: "Appearance", icon: Moon },
];

function SettingsPage() {
  const [active, setActive] = useState("store");
  const { theme, setTheme } = useTheme();
  const { brand, setBrand } = useBrand();
  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader title="Settings" subtitle="Manage your store preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition",
                active === s.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}>
              <s.icon className="size-4" /> {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          {active === "store" && (
            <Card className="p-6 space-y-5">
              <div>
                <h3 className="font-display font-semibold text-lg">Store details</h3>
                <p className="text-sm text-muted-foreground">Public information about your store.</p>
              </div>
              <Field label="Store name" value="Loom" />
              <Field label="Store URL" value="loom.shop" />
              <Field label="Support email" value="hello@loom.shop" />
              <Field label="Currency" value="USD — US Dollar" />
              <SaveBar />
            </Card>
          )}
          {active === "profile" && (
            <Card className="p-6 space-y-5">
              <div>
                <h3 className="font-display font-semibold text-lg">Your profile</h3>
                <p className="text-sm text-muted-foreground">Update your personal information.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-xl">AR</div>
                <button className="px-3 h-9 rounded-lg border border-border text-sm hover:bg-muted">Upload avatar</button>
              </div>
              <Field label="Full name" value="Alex Rivera" />
              <Field label="Email" value="alex@loom.shop" />
              <Field label="Password" value="••••••••" />
              <SaveBar />
            </Card>
          )}
          {active === "appearance" && (
            <Card className="p-6 space-y-5">
              <div>
                <h3 className="font-display font-semibold text-lg">Appearance</h3>
                <p className="text-sm text-muted-foreground">Customize the look of your admin panel.</p>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Theme</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                  ].map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id as "light" | "dark")}
                      className={cn(
                        "p-4 rounded-xl border-2 flex items-center gap-3 transition relative",
                        theme === t.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                      )}>
                      <t.icon className="size-5" />
                      <span className="font-medium">{t.label}</span>
                      {theme === t.id && <Check className="size-4 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium mb-2">Brand color</div>
                <div className="flex gap-2">
                  {["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"].map(c => (
                    <button key={c} className="size-8 rounded-full border-2 border-border" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </Card>
          )}
          {(active === "payments" || active === "shipping" || active === "tax") && (
            <Card className="p-6">
              <h3 className="font-display font-semibold text-lg capitalize">{active}</h3>
              <p className="text-sm text-muted-foreground mt-1">Configure your {active} preferences here.</p>
              <div className="mt-6 p-8 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
                Configuration UI for {active}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input defaultValue={value} className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring/50" />
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-border">
      <button className="px-3 h-9 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
      <button className="px-4 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">Save changes</button>
    </div>
  );
}
