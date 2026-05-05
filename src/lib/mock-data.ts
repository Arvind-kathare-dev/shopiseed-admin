export const revenueData = [
  { month: "Jan", revenue: 124500, orders: 38 },
  { month: "Feb", revenue: 148200, orders: 46 },
  { month: "Mar", revenue: 162900, orders: 54 },
  { month: "Apr", revenue: 198100, orders: 61 },
  { month: "May", revenue: 221800, orders: 68 },
  { month: "Jun", revenue: 267300, orders: 84 },
  { month: "Jul", revenue: 312900, orders: 97 },
  { month: "Aug", revenue: 358200, orders: 112 },
  { month: "Sep", revenue: 402500, orders: 126 },
  { month: "Oct", revenue: 468300, orders: 148 },
  { month: "Nov", revenue: 534400, orders: 167 },
  { month: "Dec", revenue: 612800, orders: 192 },
];

export const funnelData = [
  { stage: "App Downloads", value: 42800, pct: 100 },
  { stage: "Onboarded Users", value: 31400, pct: 73.4 },
  { stage: "First Purchase", value: 16200, pct: 37.9 },
  { stage: "Push Opt-In", value: 12600, pct: 29.4 },
  { stage: "Repeat Buyers", value: 8980, pct: 21.0 },
];

export const topProducts = [
  { id: "1", name: "Growth Plan (Annual)", sku: "PLN-GRO-Y", sales: 612, revenue: 4284000, stock: 999, trend: 24 },
  { id: "2", name: "Starter Plan (Monthly)", sku: "PLN-STR-M", sales: 980, revenue: 1470000, stock: 999, trend: 12 },
  { id: "3", name: "Enterprise Plan", sku: "PLN-ENT-Y", sales: 148, revenue: 2960000, stock: 999, trend: 18 },
  { id: "4", name: "Push Notification Add-on", sku: "ADD-PUSH", sales: 760, revenue: 760000, stock: 999, trend: 8 },
  { id: "5", name: "AI Personalization Add-on", sku: "ADD-AI", sales: 420, revenue: 630000, stock: 999, trend: 31 },
];

export const recentOrders = [
  { id: "#APP-1084", customer: "Thread & Co", email: "ops@threadco.in", total: 14999, status: "paid", date: "4m ago", items: 1 },
  { id: "#APP-1083", customer: "Lumina Beauty", email: "tech@luminabeauty.in", total: 4999, status: "pending", date: "28m ago", items: 2 },
  { id: "#APP-1082", customer: "NovaDrop Store", email: "hello@novadrop.co", total: 19999, status: "paid", date: "1h ago", items: 1 },
  { id: "#APP-1081", customer: "Oakly Lifestyle", email: "info@oakly.in", total: 4999, status: "refunded", date: "2h ago", items: 1 },
  { id: "#APP-1080", customer: "Zest Organics", email: "team@zestorganics.in", total: 14999, status: "paid", date: "3h ago", items: 2 },
  { id: "#APP-1079", customer: "SkyWear Apparel", email: "hi@skywear.in", total: 29999, status: "fulfilled", date: "5h ago", items: 3 },
];

export const customers = [
  { id: "1", name: "Thread & Co", email: "ops@threadco.in", orders: 3, spent: 44997, location: "Mumbai, IN", joined: "Mar 2025", status: "vip" },
  { id: "2", name: "Lumina Beauty", email: "tech@luminabeauty.in", orders: 8, spent: 119984, location: "Bengaluru, IN", joined: "Nov 2024", status: "vip" },
  { id: "3", name: "NovaDrop Store", email: "hello@novadrop.co", orders: 2, spent: 34998, location: "Delhi, IN", joined: "Jan 2026", status: "active" },
  { id: "4", name: "Oakly Lifestyle", email: "info@oakly.in", orders: 5, spent: 74995, location: "Pune, IN", joined: "Aug 2024", status: "active" },
  { id: "5", name: "Zest Organics", email: "team@zestorganics.in", orders: 12, spent: 179988, location: "Ahmedabad, IN", joined: "Feb 2024", status: "vip" },
  { id: "6", name: "SkyWear Apparel", email: "hi@skywear.in", orders: 1, spent: 29999, location: "Hyderabad, IN", joined: "Apr 2026", status: "new" },
];

export const products = topProducts.concat([
  { id: "6", name: "CRO Suite Add-on", sku: "ADD-CRO", sales: 310, revenue: 465000, stock: 999, trend: 14 },
  { id: "7", name: "White-label Branding", sku: "ADD-WL", sales: 88, revenue: 440000, stock: 999, trend: 6 },
  { id: "8", name: "Analytics Dashboard Pro", sku: "ADD-ANL", sales: 220, revenue: 220000, stock: 999, trend: -2 },
]);

export const aiInsights = [
  { title: "Push notification drop-off", body: "Thread & Co push open rate fell to 18% this week. Suggest A/B testing new copy templates for abandoned cart recovery.", tone: "warning" },
  { title: "Upsell opportunity", body: "62% of Growth Plan clients don't have the AI Personalization Add-on. Bundle email sent to 380 accounts could yield ₹23.8L.", tone: "primary" },
  { title: "Churn risk detected", body: "Lumina Beauty has not logged into the dashboard in 14 days. Trigger a proactive success call before renewal date.", tone: "destructive" },
];
