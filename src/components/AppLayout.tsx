import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useApp, Role } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleLabels: Record<Role, { label: string; emoji: string }> = {
  admin: { label: 'Admin', emoji: '👑' },
  manager: { label: 'Manager', emoji: '🧑‍💼' },
  staff: { label: 'Staff', emoji: '👨‍🍳' },
  customer: { label: 'Customer', emoji: '🙋' },
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, isDark, toggleTheme } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (value: Role) => {
    if (role === value) return;
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-30 dark:border-gray-700 dark:bg-slate-950/80 dark:text-white">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="shrink-0 text-current" />
              <ChefHat className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-lg hidden sm:inline">Spice Kitchen</span>
            </div>
            <div className="flex items-center gap-3">
              <Select value={role} onValueChange={(v) => handleRoleChange(v as Role)}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(roleLabels) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {roleLabels[r].emoji} {roleLabels[r].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="shrink-0">
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
