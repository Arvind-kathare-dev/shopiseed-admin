import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { products } from "@/lib/mock-data";
import { Plus, Search, Filter, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductsPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in catalog`}
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border text-sm hover:bg-muted">
              <Upload className="size-4" /> Import
            </button>
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">
              <Plus className="size-4" /> Add product
            </button>
          </div>
        }
      />

      <Card className="p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 h-10 rounded-lg bg-muted/60 border border-border">
          <Search className="size-4 text-muted-foreground" />
          <input placeholder="Search products by name or SKU…" className="bg-transparent text-sm outline-none flex-1" />
        </div>
        <button className="flex items-center gap-1.5 px-3 h-10 rounded-lg border border-border text-sm hover:bg-muted">
          <Filter className="size-4" /> Filters
        </button>
        <select className="px-3 h-10 rounded-lg border border-border bg-card text-sm">
          <option>All categories</option><option>Apparel</option><option>Accessories</option>
        </select>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground border-b border-border bg-muted/30">
              <tr>
                <th className="text-left font-medium px-6 py-3">Product</th>
                <th className="text-left font-medium px-3 py-3">SKU</th>
                <th className="text-right font-medium px-3 py-3">Stock</th>
                <th className="text-right font-medium px-3 py-3">Sales</th>
                <th className="text-right font-medium px-3 py-3">Revenue</th>
                <th className="text-center font-medium px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-linear-to-br from-chart-2/20 to-primary/20 border border-border" />
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">3 variants</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 font-mono text-xs text-muted-foreground">{p.sku}</td>
                  <td className={cn("px-3 py-4 text-right tabular-nums", p.stock === 0 && "text-destructive", p.stock > 0 && p.stock < 30 && "text-warning")}>
                    {p.stock}
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">{p.sales}</td>
                  <td className="px-3 py-4 text-right tabular-nums font-medium">${p.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <Pill tone={p.stock === 0 ? "destructive" : p.stock < 30 ? "warning" : "success"}>
                      {p.stock === 0 ? "Sold out" : p.stock < 30 ? "Low stock" : "Active"}
                    </Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
