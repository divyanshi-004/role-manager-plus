import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import { AppLayout } from "@/components/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

/* Pages */
import DashboardPage from "@/pages/DashboardPage";
import OrdersPage from "@/pages/OrdersPage";
import KitchenPage from "@/pages/KitchenPage";
import MenuPage from "@/pages/MenuPage";
import InventoryPage from "@/pages/InventoryPage";
import ReportsPage from "@/pages/ReportsPage";
import UsersPage from "@/pages/UsersPage";
import CustomerMenuPage from "@/pages/CustomerMenuPage";
import MyOrdersPage from "@/pages/MyOrdersPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

/* ================= PUBLIC ROUTE ================= */
function PublicRoute({ children }: any) {
  const { user } = useAuth();

  if (user) {
    if (user.role === "customer") {
      return <Navigate to="/browse-menu" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* ================= ROOT REDIRECT ================= */
function RootRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "customer") {
    return <Navigate to="/browse-menu" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function MenuRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "customer") {
    return <Navigate to="/browse-menu" replace />;
  }

  if (user.role === "admin" || user.role === "manager") {
    return <Navigate to="/manage-menu" replace />;
  }

  return <Navigate to="/unauthorized" replace />;
}

/* ================= ROUTES ================= */
function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<RootRedirect />} />
      <Route path="/menu" element={<MenuRedirect />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      {/* CUSTOMER */}
      <Route
        path="/browse-menu"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <AppLayout>
              <CustomerMenuPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <AppLayout>
              <MyOrdersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* STAFF / ADMIN */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <AppLayout>
              <OrdersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kitchen"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <AppLayout>
              <KitchenPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-menu"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <AppLayout>
              <MenuPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <AppLayout>
              <InventoryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppLayout>
              <UsersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />

      {/* UNAUTHORIZED ACCESS */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-destructive">🚫 Access Denied</h1>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact your administrator if you believe this is an error.
              </p>
            </div>
          </div>
        }
      />

    </Routes>
  );
}

/* ================= ROOT ================= */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* ✅ CORRECT ORDER */}
        <AuthProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </AuthProvider>

      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;