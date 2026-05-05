import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { recentOrders } from "@/lib/mock-data";
import { Download } from "lucide-react";

const all = [...recentOrders, ...recentOrders.map(o => ({ ...o, id: "#1023" + Math.random().toString().slice(2,5) }))];

export function OrdersPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Orders"
        subtitle="Track every order from cart to delivery"
        action={
          <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border text-sm hover:bg-muted">
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "All", count: 1392 },
          { label: "Unfulfilled", count: 24 },
          { label: "Unpaid", count: 8 },
          { label: "Refunded", count: 3 },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            <div className="text-2xl font-display font-semibold mt-1">{s.count}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border bg-muted/30">
              <tr>
                <th className="text-left font-medium px-6 py-3">Order</th>
                <th className="text-left font-medium px-3 py-3">Customer</th>
                <th className="text-left font-medium px-3 py-3">Status</th>
                <th className="text-center font-medium px-3 py-3">Items</th>
                <th className="text-right font-medium px-3 py-3">Total</th>
                <th className="text-right font-medium px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {all.map((o, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition cursor-pointer">
                  <td className="px-6 py-4 font-mono text-xs">{o.id}</td>
                  <td className="px-3 py-4">
                    <div className="font-medium">{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.email}</div>
                  </td>
                  <td className="px-3 py-4">
                    <Pill tone={o.status === "paid" ? "success" : o.status === "pending" ? "warning" : o.status === "refunded" ? "destructive" : "primary"}>
                      {o.status}
                    </Pill>
                  </td>
                  <td className="px-3 py-4 text-center text-muted-foreground">{o.items}</td>
                  <td className="px-3 py-4 text-right tabular-nums font-medium">${o.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
