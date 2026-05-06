import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { BrandProvider } from "@/lib/brand";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import { AppShell } from "@/components/admin/AppShell";
import { AuthLayout } from "@/pages/auth/AuthLayout";

// Auth Pages
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignUpPage } from "@/pages/auth/SignUpPage";
import { ForgotPage } from "@/pages/auth/ForgotPage";
import { ResetPage } from "@/pages/auth/ResetPage";

// Admin Pages
import { DashboardPage } from "@/pages/admin/DashboardPage";
import { OnboardingPage } from "@/pages/admin/OnboardingPage";
import { AnalyticsPage } from "@/pages/admin/AnalyticsPage";
import { CampaignsPage } from "@/pages/admin/CampaignsPage";
import { CustomersPage } from "@/pages/admin/CustomersPage";
import { InsightsPage } from "@/pages/admin/InsightsPage";
import { OrdersPage } from "@/pages/admin/OrdersPage";
import { ProductsPage } from "@/pages/admin/ProductsPage";
import { SettingsPage } from "@/pages/admin/SettingsPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { CategoriesPage } from "./pages/admin/CategoriesPage";

// Protected Route Component
function ProtectedRoute() {
  const isAuth = !!localStorage.getItem("auth_token");
  if (!isAuth) return <Navigate to="/login" replace />;
  return <AppShell />;
}

// Public Route Component (Redirect to home if already auth)
function PublicRoute() {
  const isAuth = !!localStorage.getItem("auth_token");
  if (isAuth) return <Navigate to="/" replace />;
  return <Outlet />;
}

function App() {
  return (
    <ThemeProvider>
      <BrandProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/forgot" element={<ForgotPage />} />
                  <Route path="/reset" element={<ResetPage />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/campaigns" element={<CampaignsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </BrandProvider>
    </ThemeProvider>
  );
}

export default App;
