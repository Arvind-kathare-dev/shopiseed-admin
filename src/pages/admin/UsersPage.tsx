import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, X, MoreVertical, 
  ExternalLink, User, Globe, Tag, CreditCard,
  ChevronLeft, ChevronRight, AlertCircle,
  ShoppingBag, Shirt, Cpu, Coffee, Sparkles, MoreHorizontal,
  Zap, Star, ShieldCheck, Loader2
} from "lucide-react";
import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { CustomDropdown } from "@/components/admin/CustomDropdown";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

interface UserData {
  id: string;
  fullName: string;
  shopUrl: string;
  category: string;
  plan: string;
  createdAt: string;
  updatedAt?: string;
}

const CATEGORY_OPTIONS = [
  { value: "E-commerce", label: "E-commerce", icon: ShoppingBag },
  { value: "Fashion", label: "Fashion", icon: Shirt },
  { value: "Electronics", label: "Electronics", icon: Cpu },
  { value: "Food & Drink", label: "Food & Drink", icon: Coffee },
  { value: "Health & Beauty", label: "Health & Beauty", icon: Sparkles },
  { value: "Other", label: "Other", icon: MoreHorizontal },
];

const PLAN_OPTIONS = [
  { value: "Free", label: "Free", icon: User },
  { value: "Basic", label: "Basic", icon: Zap },
  { value: "Pro", label: "Pro", icon: Star },
  { value: "Enterprise", label: "Enterprise", icon: ShieldCheck },
];

const CATEGORIES = CATEGORY_OPTIONS.map(opt => opt.value);
const PLANS = PLAN_OPTIONS.map(opt => opt.value);



export function UsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await api.getUsers(token) as any;
      const data = Array.isArray(response) ? response : (response.data || []);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    shopUrl: "",
    category: CATEGORIES[0],
    plan: PLANS[0]
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.fullName?.toLowerCase() || "").includes(search.toLowerCase()) || 
                         (u.shopUrl?.toLowerCase() || "").includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || u.category === categoryFilter;
    const matchesPlan = !planFilter || u.plan === planFilter;
    return matchesSearch && matchesCategory && matchesPlan;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const response = await api.createUser(formData, token) as any;
      const newUser = response.data || response;
      setUsers([newUser, ...users]);
      setIsAddModalOpen(false);
      resetForm();
      toast.success("User added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add user");
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !token) return;
    try {
      const id = editingUser.id;
      if (!id) throw new Error("User ID is missing");
      
      const response = await api.updateUser(id, formData, token) as any;
      const updatedUser = response.data;
      
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      setEditingUser(null);
      resetForm();
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser || !token) return;
    try {
      const id = deletingUser.id;
      if (!id) throw new Error("User ID is missing");
      
      await api.deleteUser(id, token);
      setUsers(users.filter(u => u.id !== id));
      setDeletingUser(null);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({ fullName: "", shopUrl: "", category: CATEGORIES[0], plan: PLANS[0] });
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      shopUrl: user.shopUrl,
      category: user.category,
      plan: user.plan
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4 sm:px-6">
      <PageHeader 
        title="Users" 
        subtitle="Manage your platform users and their store details"
        action={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow hover:opacity-90 transition-all"
          >
            <Plus className="size-4" /> Add User
          </button>
        }
      />

      {/* Filters & Search */}
      <Card className="p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by name or shop URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <CustomDropdown 
            options={[{ value: "", label: "All Categories", icon: Tag }, ...CATEGORY_OPTIONS]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            className="flex-1 md:w-48"
          />
          <CustomDropdown 
            options={[{ value: "", label: "All Plans", icon: CreditCard }, ...PLAN_OPTIONS]}
            value={planFilter}
            onChange={setPlanFilter}
            className="flex-1 md:w-48"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">User Information</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Shop Details</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plan & Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Joined Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Loading users...
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentUsers.length > 0 ? currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-primary/10 flex items-center justify-center text-primary font-bold">
                        {(user.fullName || "U").charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{user.fullName || "N/A"}</div>
                        <div className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                          ID: {user.id ? user.id.slice(-6) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Globe className="size-3.5 text-muted-foreground" />
                        {(user.shopUrl || "no-url.com").replace("https://", "").replace("http://", "")}
                      </div>
                      <a 
                        href={user.shopUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-primary hover:underline flex items-center gap-1"
                      >
                        Visit Store <ExternalLink className="size-2.5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <Tag className="size-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">{user.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="size-3.5 text-muted-foreground" />
                        <Pill tone={user.plan === "Enterprise" ? "primary" : user.plan === "Pro" ? "success" : "default"}>
                          {user.plan}
                        </Pill>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingUser(user)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/50 flex items-center justify-between bg-muted/10">
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="text-foreground">{filteredUsers.length}</span> users
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "size-8 rounded-lg text-xs font-bold transition-all",
                    currentPage === i + 1 
                      ? "bg-primary text-primary-foreground shadow-glow" 
                      : "border border-border hover:bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="size-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AnimatePresence>
        {(isAddModalOpen || editingUser) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddModalOpen(false); setEditingUser(null); resetForm(); }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border shadow-elegant rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-xl font-display font-semibold">
                  {editingUser ? "Edit User" : "Add New User"}
                </h3>
                <button 
                  onClick={() => { setIsAddModalOpen(false); setEditingUser(null); resetForm(); }}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <form onSubmit={editingUser ? handleEditUser : handleAddUser} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input 
                      required
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shop URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input 
                      required
                      type="url"
                      value={formData.shopUrl}
                      onChange={(e) => setFormData({ ...formData, shopUrl: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="https://your-shop.myshopify.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <CustomDropdown 
                    label="Category"
                    options={CATEGORY_OPTIONS}
                    value={formData.category}
                    onChange={(val) => setFormData({ ...formData, category: val })}
                    icon={Tag}
                  />
                  <CustomDropdown 
                    label="Plan"
                    options={PLAN_OPTIONS}
                    value={formData.plan}
                    onChange={(val) => setFormData({ ...formData, plan: val })}
                    icon={CreditCard}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingUser(null); resetForm(); }}
                    className="flex-1 h-11 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-90 transition-all"
                  >
                    {editingUser ? "Save Changes" : "Add User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingUser(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-card border border-border shadow-elegant rounded-2xl p-6 text-center"
            >
              <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4 text-destructive">
                <AlertCircle className="size-7" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">Delete User</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-semibold text-foreground">{deletingUser.fullName || "this user"}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingUser(null)}
                  className="flex-1 h-10 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteUser}
                  className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground font-semibold text-sm shadow-glow hover:opacity-90 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
