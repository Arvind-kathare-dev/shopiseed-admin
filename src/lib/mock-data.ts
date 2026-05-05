export const revenueData = [
  { month: "Jan", revenue: 24500, orders: 320 },
  { month: "Feb", revenue: 31200, orders: 410 },
  { month: "Mar", revenue: 28900, orders: 380 },
  { month: "Apr", revenue: 42100, orders: 540 },
  { month: "May", revenue: 39800, orders: 510 },
  { month: "Jun", revenue: 51300, orders: 660 },
  { month: "Jul", revenue: 58900, orders: 720 },
  { month: "Aug", revenue: 64200, orders: 810 },
  { month: "Sep", revenue: 71500, orders: 890 },
  { month: "Oct", revenue: 82300, orders: 1020 },
  { month: "Nov", revenue: 95400, orders: 1180 },
  { month: "Dec", revenue: 112800, orders: 1390 },
];

export const funnelData = [
  { stage: "Visitors", value: 124000, pct: 100 },
  { stage: "Product Views", value: 68400, pct: 55 },
  { stage: "Add to Cart", value: 21200, pct: 17 },
  { stage: "Checkout", value: 9800, pct: 7.9 },
  { stage: "Purchases", value: 6240, pct: 5 },
];

export const topProducts = [
  { id: "1", name: "Aurora Sneakers", sku: "AUR-001", sales: 1240, revenue: 124000, stock: 84, trend: 12 },
  { id: "2", name: "Nimbus Hoodie", sku: "NMB-220", sales: 980, revenue: 78400, stock: 132, trend: 8 },
  { id: "3", name: "Eclipse Backpack", sku: "ECL-330", sales: 760, revenue: 91200, stock: 42, trend: -3 },
  { id: "4", name: "Solstice Watch", sku: "SOL-440", sales: 612, revenue: 183600, stock: 18, trend: 24 },
  { id: "5", name: "Halo Earbuds", sku: "HAL-550", sales: 540, revenue: 64800, stock: 220, trend: 5 },
];

export const recentOrders = [
  { id: "#10248", customer: "Emma Carter", email: "emma@acme.io", total: 248.0, status: "paid", date: "2m ago", items: 3 },
  { id: "#10247", customer: "Liam Wright", email: "liam@hey.com", total: 89.5, status: "pending", date: "12m ago", items: 1 },
  { id: "#10246", customer: "Noah Patel", email: "noah@studio.co", total: 512.9, status: "paid", date: "44m ago", items: 5 },
  { id: "#10245", customer: "Ava Chen", email: "ava@chen.dev", total: 124.0, status: "refunded", date: "1h ago", items: 2 },
  { id: "#10244", customer: "Mia Rodriguez", email: "mia@studio.co", total: 320.75, status: "paid", date: "2h ago", items: 4 },
  { id: "#10243", customer: "Oliver Kim", email: "oliver@kim.so", total: 64.0, status: "fulfilled", date: "3h ago", items: 1 },
];

export const customers = [
  { id: "1", name: "Emma Carter", email: "emma@acme.io", orders: 12, spent: 2480, location: "New York, US", joined: "Mar 2024", status: "active" },
  { id: "2", name: "Liam Wright", email: "liam@hey.com", orders: 4, spent: 358, location: "London, UK", joined: "Jul 2024", status: "active" },
  { id: "3", name: "Noah Patel", email: "noah@studio.co", orders: 22, spent: 5129, location: "Mumbai, IN", joined: "Jan 2023", status: "vip" },
  { id: "4", name: "Ava Chen", email: "ava@chen.dev", orders: 7, spent: 1240, location: "Singapore", joined: "Oct 2024", status: "active" },
  { id: "5", name: "Mia Rodriguez", email: "mia@studio.co", orders: 15, spent: 3207, location: "Madrid, ES", joined: "Feb 2024", status: "vip" },
  { id: "6", name: "Oliver Kim", email: "oliver@kim.so", orders: 2, spent: 128, location: "Seoul, KR", joined: "Apr 2025", status: "new" },
];

export const products = topProducts.concat([
  { id: "6", name: "Vortex Cap", sku: "VTX-660", sales: 410, revenue: 16400, stock: 90, trend: 4 },
  { id: "7", name: "Lumen Lamp", sku: "LUM-770", sales: 320, revenue: 28800, stock: 12, trend: 18 },
  { id: "8", name: "Atlas Tote", sku: "ATL-880", sales: 280, revenue: 14000, stock: 0, trend: -8 },
]);

export const aiInsights = [
  { title: "Inventory at risk", body: "Solstice Watch will sell out in ~6 days at current pace. Reorder 200 units.", tone: "warning" },
  { title: "Upsell opportunity", body: "Customers buying Aurora Sneakers add Nimbus Hoodie 38% of the time. Bundle them.", tone: "primary" },
  { title: "Churn signal", body: "VIP segment activity dropped 12% this week. Trigger a win-back campaign.", tone: "destructive" },
];
