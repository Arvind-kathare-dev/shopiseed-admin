import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { 
  Download, ExternalLink, Mail, Phone, Users, Store, 
  Target, DollarSign, Calendar, TrendingUp, Zap, Clock,
  Filter, ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

interface Lead {
  _id: string;
  fullName: string;
  workEmail: string;
  phone: string;
  storeName: string;
  storeUrl: string;
  whatDoYouSell: string;
  achieve: string;
  launchSoon: string;
  features: string;
  monthlyRevenue: string;
  createdAt: string;
}

export function OnboardingPage() {
  const { token } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLeads = async () => {
      if (!token) return;
      try {
        const response = (await api.getOnboardingLeads(token)) as any;
        const leadData = Array.isArray(response) ? response : (response.data || []);
        setLeads(leadData);
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [token]);

  // Derived pagination data
  const totalPages = Math.ceil(leads.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      <PageHeader
        title="Onboarding Leads"
        subtitle="Review and manage new store onboarding submissions"
        action={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border text-sm hover:bg-muted transition-all">
              <Filter className="size-4" /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-glow hover:opacity-90 transition-all">
              <Download className="size-4" /> Export CSV
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Inquiries", value: leads.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Urgent Leads", value: leads.filter(l => l.launchSoon?.toLowerCase().includes("asap")).length, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "High Growth", value: leads.filter(l => !l.monthlyRevenue?.includes("under")).length, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 relative overflow-hidden group border-none bg-card shadow-elegant">
            <div className={`absolute -right-4 -top-4 size-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Updates</span>
              </div>
              <div className="text-3xl font-display font-bold text-foreground">
                {loading ? (
                  <div className="h-9 w-12 bg-muted animate-pulse rounded" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-4">
             <div className="text-sm font-semibold flex items-center gap-2">
               <div className="size-2 rounded-full bg-success animate-pulse" />
               Recent Submissions
             </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Sort by: <span className="text-foreground font-medium flex items-center gap-1 cursor-pointer hover:text-primary">Newest <ChevronDown className="size-3" /></span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-muted/10">
                <th className="px-6 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  <div className="flex items-center gap-2">
                    <Users className="size-3.5" /> Merchant Info
                  </div>
                </th>
                <th className="px-4 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  <div className="flex items-center gap-2">
                    <Store className="size-3.5" /> Store Context
                  </div>
                </th>
                <th className="px-4 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  <div className="flex items-center gap-2">
                    <Target className="size-3.5" /> Objectives
                  </div>
                </th>
                <th className="px-4 py-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-3.5" /> Monthly Rev
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  <div className="flex items-center justify-end gap-2">
                    <Calendar className="size-3.5" /> Created At
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <Users className="size-6" />
                      </div>
                      <div className="text-muted-foreground font-medium">No leads found in your database.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        {lead.fullName}
                        {lead.launchSoon?.toLowerCase().includes("asap") && (
                           <Pill tone="destructive" className="px-1.5 py-0 scale-75 origin-left animate-pulse">URGENT</Pill>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <a href={`mailto:${lead.workEmail}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                          <div className="size-5 rounded bg-muted/50 grid place-items-center"><Mail className="size-3" /></div>
                          {lead.workEmail}
                        </a>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="size-5 rounded bg-muted/50 grid place-items-center"><Phone className="size-3" /></div>
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <div className="font-bold text-foreground">{lead.storeName}</div>
                      <div className="text-[11px] font-medium text-primary mt-0.5 uppercase tracking-tighter opacity-80">{lead.whatDoYouSell}</div>
                      <a 
                        href={lead.storeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-primary mt-3 transition-colors"
                      >
                        <ExternalLink className="size-3" /> Visit Storefront
                      </a>
                    </td>
                    <td className="px-4 py-5">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          <Pill tone="primary" className="text-[9px] font-bold px-2 py-0.5 border-none bg-blue-500/10 text-blue-500 uppercase">
                            {lead.achieve?.replace(/_/g, ' ')}
                          </Pill>
                          <Pill tone="success" className="text-[9px] font-bold px-2 py-0.5 border-none bg-emerald-500/10 text-emerald-500 uppercase">
                            {lead.launchSoon}
                          </Pill>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium italic">
                          <Zap className="size-3 text-amber-500" /> {lead.features?.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5 font-mono font-bold text-foreground">
                      <div className="flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-emerald-500" />
                        {lead.monthlyRevenue}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                          <Clock className="size-3.5 text-muted-foreground" />
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "N/A"}
                        </div>
                        <div className="text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ""}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!loading && leads.length > 0 && (
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground">{indexOfFirstItem + 1}</span> to <span className="text-foreground">{Math.min(indexOfLastItem, leads.length)}</span> of <span className="text-foreground">{leads.length}</span> leads
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`size-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? "bg-primary text-primary-foreground shadow-glow" 
                      : "border border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
