import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Edit2, Trash2, X, MoreVertical, 
  Tag, ChevronLeft, ChevronRight, AlertCircle,
  ShoppingBag, Shirt, Cpu, Coffee, Sparkles, Package,
  Zap, ShieldCheck, Smartphone, Gamepad2, Heart, Home,
  Watch, Car, Utensils, Gift, Loader2, Layers,
  ExternalLink, Laptop, Headphones, Camera, Music, 
  Activity, Book, Brush, Dumbbell, Globe, Mic,
  Moon, Sun, Star, Trophy, Tv, Users2
} from "lucide-react";
import { Card, PageHeader, Pill } from "@/components/admin/PageHeader";
import { CustomDropdown } from "@/components/admin/CustomDropdown";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

interface CategoryData {
  _id: string;
  id?: string;
  name: string;
  icon: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const ICON_MAP: Record<string, any> = {
  ShoppingBag, Shirt, Cpu, Coffee, Sparkles, Package,
  Zap, ShieldCheck, Smartphone, Gamepad2, Heart, Home,
  Watch, Car, Utensils, Gift, Layers, Laptop, 
  Headphones, Camera, Music, Activity, Book, Brush, 
  Dumbbell, Globe, Mic, Moon, Sun, Star, Trophy, 
  Tv, Users2
};

const ICON_OPTIONS = Object.keys(ICON_MAP).map(key => ({
  value: key,
  label: key,
  icon: ICON_MAP[key]
}));

export function CategoriesPage() {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    icon: ICON_OPTIONS[0].value
  });

  const fetchCategories = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await api.getCategories(token) as any;
      const data = response.data || response || [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const currentCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const response = await api.createCategory(formData, token) as any;
      const newCategory = response.data || response;
      setCategories([newCategory, ...categories]);
      setIsAddModalOpen(false);
      resetForm();
      toast.success("Category created successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to create category");
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !token) return;
    try {
      const id = editingCategory._id || editingCategory.id;
      if (!id) throw new Error("Category ID is missing");
      
      const response = await api.updateCategory(id, formData, token) as any;
      const updatedCategory = response.data || response;
      
      setCategories(categories.map(c => (c._id === id || c.id === id) ? updatedCategory : c));
      setEditingCategory(null);
      resetForm();
      toast.success("Category updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory || !token) return;
    try {
      const id = deletingCategory._id || deletingCategory.id;
      if (!id) throw new Error("Category ID is missing");
      
      await api.deleteCategory(id, token);
      setCategories(categories.filter(c => (c._id !== id && c.id !== id)));
      setDeletingCategory(null);
      toast.success("Category deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", icon: ICON_OPTIONS[0].value });
  };

  const openEditModal = (category: CategoryData) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon
    });
  };

  const getIconComponent = (iconName: string) => {
    const IconComp = ICON_MAP[iconName] || Tag;
    return <IconComp className="size-4" />;
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4 sm:px-6">
      <PageHeader 
        title="Categories" 
        subtitle="Organize your products with custom categories"
        action={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow hover:opacity-90 transition-all"
          >
            <Plus className="size-4" /> Add Category
          </button>
        }
      />

      {/* Filters & Search */}
      <Card className="p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </Card>

      {/* Categories Grid/Table */}
      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Category Info</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Slug</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Created At</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Loading categories...
                      </div>
                    </td>
                  </tr>
                ))
              ) : currentCategories.length > 0 ? currentCategories.map((category) => (
                <tr key={category._id || category.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center text-primary">
                        {getIconComponent(category.icon)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{category.name}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">ID: {(category._id || category.id || "").slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-muted/50 px-2 py-1 rounded text-primary">/{category.slug}</code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(category)}
                        className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button 
                        onClick={() => setDeletingCategory(category)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No categories found.
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
              Showing <span className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredCategories.length)}</span> of <span className="text-foreground">{filteredCategories.length}</span> categories
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingCategory) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); resetForm(); }}
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
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button 
                  onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); resetForm(); }}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category Name</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="e.g. Electronics"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Icon</label>
                  <CustomDropdown 
                    options={ICON_OPTIONS}
                    value={formData.icon}
                    onChange={(val) => setFormData({ ...formData, icon: val })}
                    placeholder="Choose an icon"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); resetForm(); }}
                    className="flex-1 h-11 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm shadow-glow hover:opacity-90 transition-all"
                  >
                    {editingCategory ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {deletingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingCategory(null)}
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
              <h3 className="text-lg font-display font-semibold mb-2">Delete Category</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to delete <span className="font-semibold text-foreground">{deletingCategory.name}</span>? All products in this category will be affected.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingCategory(null)}
                  className="flex-1 h-10 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteCategory}
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
