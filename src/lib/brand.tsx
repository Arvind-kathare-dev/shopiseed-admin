import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const BRAND_COLORS = [
  { id: "emerald", label: "Emerald", hex: "#10b981", primary: "0.74 0.2 152", primaryLight: "0.62 0.21 152", glowHue: "152" },
  { id: "blue", label: "Blue", hex: "#3b82f6", primary: "0.7 0.18 250", primaryLight: "0.6 0.2 250", glowHue: "250" },
  { id: "violet", label: "Violet", hex: "#8b5cf6", primary: "0.7 0.2 295", primaryLight: "0.6 0.22 295", glowHue: "295" },
  { id: "pink", label: "Pink", hex: "#ec4899", primary: "0.72 0.22 350", primaryLight: "0.62 0.24 350", glowHue: "350" },
  { id: "amber", label: "Amber", hex: "#f59e0b", primary: "0.78 0.16 75", primaryLight: "0.7 0.18 75", glowHue: "75" },
] as const;

export type BrandId = typeof BRAND_COLORS[number]["id"];

type Ctx = { brand: BrandId; setBrand: (b: BrandId) => void };
const BrandCtx = createContext<Ctx | null>(null);

function applyBrand(id: BrandId) {
  const b = BRAND_COLORS.find(x => x.id === id) ?? BRAND_COLORS[0];
  const root = document.documentElement;
  const isDark = root.classList.contains("dark");
  const p = isDark ? b.primary : b.primaryLight;
  root.style.setProperty("--primary", `oklch(${p})`);
  root.style.setProperty("--ring", `oklch(${p})`);
  root.style.setProperty("--sidebar-primary", `oklch(${p})`);
  root.style.setProperty("--sidebar-ring", `oklch(${p})`);
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, oklch(${p}) 0%, oklch(${p} / 0.75) 100%)`
  );
  root.style.setProperty(
    "--gradient-glow",
    `radial-gradient(60% 60% at 50% 0%, oklch(${p} / 0.22) 0%, transparent 70%)`
  );
  root.style.setProperty(
    "--shadow-glow",
    `0 0 0 1px oklch(${p} / 0.25), 0 10px 40px -10px oklch(${p} / 0.45)`
  );
  root.style.setProperty("--accent", isDark ? `oklch(0.28 0.06 ${b.glowHue})` : `oklch(0.95 0.04 ${b.glowHue})`);
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [brand, setBrandState] = useState<BrandId>("violet");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("brand")) as BrandId | null;
    if (stored && BRAND_COLORS.some(b => b.id === stored)) setBrandState(stored);
  }, []);

  useEffect(() => {
    applyBrand(brand);
    localStorage.setItem("brand", brand);
    // re-apply when theme toggles
    const obs = new MutationObserver(() => applyBrand(brand));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, [brand]);

  return <BrandCtx.Provider value={{ brand, setBrand: setBrandState }}>{children}</BrandCtx.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandCtx);
  if (!ctx) throw new Error("useBrand outside provider");
  return ctx;
}
