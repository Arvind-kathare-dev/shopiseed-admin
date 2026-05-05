import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { customers } from "@/lib/mock-data";
import { Mail, Search } from "lucide-react";

export function CustomersPage() {
  return (
    <div className="max-w-[1600px] mx-auto">
      <PageHeader title="Customers" subtitle={`${customers.length} customers · 78% returning`} />

      <Card className="p-4 mb-4 flex items-center gap-2 px-3 h-12 sm:h-auto">
        <Search className="size-4 text-muted-foreground" />
        <input placeholder="Search customers…" className="bg-transparent text-sm outline-none flex-1" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map(c => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start gap-3">
              <div className="size-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                {c.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold truncate">{c.name}</div>
                  <Pill tone={c.status === "vip" ? "primary" : c.status === "new" ? "warning" : "success"}>{c.status}</Pill>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="size-3" /> {c.email}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.location}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
              <Stat k="Orders" v={c.orders.toString()} />
              <Stat k="Spent" v={`$${c.spent.toLocaleString()}`} />
              <Stat k="Joined" v={c.joined} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="text-sm font-medium tabular-nums mt-0.5">{v}</div>
    </div>
  );
}
