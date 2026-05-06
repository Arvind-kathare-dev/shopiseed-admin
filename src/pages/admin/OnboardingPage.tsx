import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { 
  Download, ExternalLink, Mail, Phone, Users, Store, 
  Target, DollarSign, Calendar, TrendingUp, Zap, Clock,
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  TrendingDown, Activity, AlertCircle, X, CheckCircle2,
  Briefcase, ShoppingBag, Eye, Info, ChevronRight as ArrowRight,
  Globe, ShieldCheck, MapPin, MousePointerClick
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { CustomDropdown } from "@/components/admin/CustomDropdown";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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

const REVENUE_OPTIONS = [
  { value: "Under $1k", label: "Under $1k", icon: DollarSign },
  { value: "$1k - $10k", label: "$1k - $10k", icon: DollarSign },
  { value: "$10k - $50k", label: "$10k - $50k", icon: DollarSign },
  { value: "$50k - $200k", label: "$50k - $200k", icon: DollarSign },
  { value: "$200k+", label: "$200k+", icon: TrendingUp },
];

const OBJECTIVE_OPTIONS = [
  { value: "increase_sales", label: "Increase Sales", icon: TrendingUp },
  { value: "reduce_abandonment", label: "Reduce Abandonment", icon: TrendingDown },
  { value: "launch", label: "Launch Store", icon: Zap },
  { value: "growth", label: "Business Growth", icon: Target },
];

// Helper to get initials
const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || "??";
};

// Helper for avatar color based on name
const getAvatarColor = (name: string) => {
  if (!name) return 'bg-slate-500';
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 
    'bg-amber-500', 'bg-rose-500', 'bg-indigo-500'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

export function OnboardingPage() {
  const { token } = useAuthStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [revenueFilter, setRevenueFilter] = useState("");
  const [objectiveFilter, setObjectiveFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchLeads = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = (await api.getOnboardingLeads(token)) as any;
      const leadData = Array.isArray(response) ? response : (response.data || []);
      setLeads(leadData);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to load onboarding leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [token]);

  const filteredLeads = useMemo(() => {
    let result = leads.filter(lead => {
      const matchesSearch = 
        (lead.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        (lead.storeName || "").toLowerCase().includes(search.toLowerCase()) ||
        (lead.workEmail || "").toLowerCase().includes(search.toLowerCase());
      
      const matchesRevenue = !revenueFilter || lead.monthlyRevenue === revenueFilter;
      const matchesObjective = !objectiveFilter || lead.achieve?.toLowerCase().includes(objectiveFilter.toLowerCase());

      return matchesSearch && matchesRevenue && matchesObjective;
    });

    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [leads, search, revenueFilter, objectiveFilter, sortBy]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const currentLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4 sm:px-6">
      <PageHeader
        title="Onboarding"
        subtitle="Manage and track incoming merchant submissions"
        action={
          <button 
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-foreground text-background dark:bg-primary dark:text-primary-foreground text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
          >
            <Download className="size-4" /> Export CSV
          </button>
        }
      />

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Leads", value: leads.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Urgent Action", value: leads.filter(l => l.launchSoon?.toLowerCase().includes("asap")).length, icon: Zap, color: "text-rose-500", bg: "bg-rose-500/10" },
          { label: "Growth Focus", value: leads.filter(l => l.achieve?.toLowerCase().includes("growth") || l.achieve?.toLowerCase().includes("sales")).length, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Conversion Rate", value: "24%", icon: MousePointerClick, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 relative overflow-hidden border-none bg-card shadow-sm group">
            <div className={`absolute -right-2 -top-2 size-16 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("size-4", stat.color)} />
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Monthly</div>
              </div>
              <div className="text-2xl font-display font-black text-foreground">
                {loading ? <div className="h-8 w-12 bg-muted animate-pulse rounded" /> : stat.value}
              </div>
              <div className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">{stat.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 h-11 bg-card/40 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <CustomDropdown 
            options={[{ value: "", label: "All Revenue", icon: DollarSign }, ...REVENUE_OPTIONS]}
            value={revenueFilter}
            onChange={(val) => { setRevenueFilter(val); setCurrentPage(1); }}
            className="w-40"
            placeholder="Revenue"
          />
          <CustomDropdown 
            options={[{ value: "", label: "All Goals", icon: Target }, ...OBJECTIVE_OPTIONS]}
            value={objectiveFilter}
            onChange={(val) => { setObjectiveFilter(val); setCurrentPage(1); }}
            className="w-40"
            placeholder="Goal"
          />
          {(search || revenueFilter || objectiveFilter) && (
            <button 
              onClick={() => { setSearch(""); setRevenueFilter(""); setObjectiveFilter(""); }}
              className="px-3 h-11 rounded-xl text-muted-foreground hover:text-primary transition-all text-xs font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm backdrop-blur-md">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/5">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">Merchant</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">Store Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">Niche & Goal</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">Revenue</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">Submitted</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-6 py-8"><div className="h-8 bg-muted/20 animate-pulse rounded-lg" /></td></tr>
                ))
              ) : currentLeads.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">No leads matching your criteria.</td></tr>
              ) : (
                currentLeads.map((lead) => (
                  <tr key={lead._id} className="group hover:bg-muted/10 transition-all duration-300">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm",
                          getAvatarColor(lead.fullName)
                        )}>
                          {getInitials(lead.fullName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                            {lead.fullName || "N/A"}
                            {lead.launchSoon?.toLowerCase().includes("asap") && (
                              <div className="size-1.5 rounded-full bg-red-500 shadow-glow animate-pulse" title="Urgent" />
                            )}
                          </span>
                          <span className="text-[11px] text-muted-foreground mt-0.5 opacity-70 truncate max-w-[150px]">{lead.workEmail || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          <Store className="size-3 text-primary/60" />
                          {lead.storeName || "N/A"}
                        </span>
                        {lead.storeUrl ? (
                          <a href={lead.storeUrl} target="_blank" rel="noreferrer" className="text-[10px] text-primary/70 hover:text-primary hover:underline mt-1 flex items-center gap-1">
                            Visit Store <ExternalLink className="size-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-muted-foreground mt-1">No URL provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground border border-border/30 uppercase tracking-tighter">
                          {lead.whatDoYouSell || "N/A"}
                        </span>
                        <ArrowRight className="size-3 text-muted-foreground/30" />
                        <span className="text-[10px] font-semibold text-foreground/80 capitalize">
                          {lead.achieve?.replace(/_/g, ' ') || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-emerald-500/90 font-mono tracking-tighter bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                        {lead.monthlyRevenue || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-foreground">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5 font-medium opacity-60">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-xl bg-muted/30 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer group/btn"
                        >
                          <Eye className="size-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          disabled={!lead.workEmail}
                          onClick={() => window.location.href = `mailto:${lead.workEmail}`}
                          className="p-2 rounded-xl bg-muted/30 hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer group/btn disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Mail className="size-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex items-center justify-between bg-muted/5 border-t border-border/20">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">
            {filteredLeads.length} total submissions
          </p>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-border/40 hover:bg-muted disabled:opacity-20 cursor-pointer transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-foreground min-w-[20px] text-center">{currentPage}</span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs font-medium text-muted-foreground min-w-[20px] text-center">{totalPages || 1}</span>
            </div>
            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-border/40 hover:bg-muted disabled:opacity-20 cursor-pointer transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLead(null)}
              className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-md cursor-pointer"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-4xl overflow-hidden"
            >
              {/* Modal Header with Avatar */}
              <div className="relative h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
                <div className="absolute -bottom-10 left-8 flex items-end gap-5">
                  <div className={cn(
                    "size-24 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-card",
                    getAvatarColor(selectedLead.fullName)
                  )}>
                    {getInitials(selectedLead.fullName)}
                  </div>
                  <div className="mb-2">
                    <h3 className="text-2xl font-display font-black tracking-tight text-foreground">{selectedLead.fullName || "N/A"}</h3>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5" /> {selectedLead.workEmail || "N/A"}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-6 right-6 p-2 rounded-xl bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-sm"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-8 pt-16 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-thin">
                {/* Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Revenue', value: selectedLead.monthlyRevenue, icon: DollarSign, color: 'text-emerald-500' },
                    { label: 'Timeline', value: selectedLead.launchSoon, icon: Clock, color: 'text-blue-500' },
                    { label: 'Niche', value: selectedLead.whatDoYouSell, icon: ShoppingBag, color: 'text-purple-500' },
                    { label: 'Goal', value: selectedLead.achieve?.replace(/_/g, ' '), icon: Target, color: 'text-amber-500' },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <item.icon className={cn("size-3", item.color)} />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                      </div>
                      <p className="text-xs font-bold text-foreground truncate capitalize">{item.value || "N/A"}</p>
                    </div>
                  ))}
                </div>

                {/* Detail Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      <Store className="size-3" /> Store Profile
                    </h4>
                    <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Name</span>
                        <p className="text-sm font-semibold text-foreground mt-0.5">{selectedLead.storeName || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Digital Address</span>
                        {selectedLead.storeUrl ? (
                          <a href={selectedLead.storeUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1.5 mt-0.5">
                            <Globe className="size-3.5" />
                            {selectedLead.storeUrl.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold text-muted-foreground mt-0.5">N/A</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                      <ShieldCheck className="size-3" /> Verification
                    </h4>
                    <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Phone</span>
                        <p className="text-sm font-semibold text-foreground mt-0.5 flex items-center gap-2">
                          <Phone className="size-3.5 text-muted-foreground" />
                          {selectedLead.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Submission Status</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="size-1.5 rounded-full bg-emerald-500 shadow-glow" />
                          <span className="text-[11px] font-bold text-foreground">Verified Merchant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity className="size-3" /> Strategic Requirements
                  </h4>
                  <div className="p-6 rounded-2xl bg-foreground/3 border-l-4 border-primary shadow-sm">
                    <p className="text-sm text-foreground/90 leading-relaxed font-medium italic">
                      {selectedLead.features ? `"${selectedLead.features.replace(/_/g, ' ')}"` : "No specific features or strategies were provided in the initial submission."}
                    </p>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-border/40">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar className="size-3" /> {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}</span>
                    <span className="flex items-center gap-1.5"><Clock className="size-3" /> {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleTimeString() : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/40 px-3 py-1 rounded-full border border-border/50">
                    <Info className="size-3" /> ID: <span className="font-mono text-[9px] lowercase tracking-normal">{selectedLead._id || "unknown"}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-muted/10 border-t border-border/40 flex gap-4">
                <button 
                  disabled={!selectedLead.workEmail}
                  onClick={() => {
                    window.location.href = `mailto:${selectedLead.workEmail}`;
                    toast.success("Opening email client...");
                  }}
                  className="flex-1 h-12 rounded-2xl bg-foreground text-background dark:bg-primary dark:text-primary-foreground font-black text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Mail className="size-4" /> Message Merchant
                </button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-8 h-12 rounded-2xl border border-border bg-background text-sm font-bold hover:bg-muted transition-all cursor-pointer active:scale-95"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
