import {
  LayoutDashboard, ShoppingCart, ChefHat, BookOpen, Package, BarChart3, Users, UtensilsCrossed,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useApp, Role } from "@/contexts/AppContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

interface NavItem { title: string; url: string; icon: React.ElementType; roles: Role[] }

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { title: "Orders", url: "/orders", icon: ShoppingCart, roles: ['admin', 'manager', 'staff'] },
  { title: "Kitchen", url: "/kitchen", icon: ChefHat, roles: ['admin', 'staff'] },
  { title: "Menu", url: "/manage-menu", icon: BookOpen, roles: ['admin'] },
  { title: "Inventory", url: "/inventory", icon: Package, roles: ['admin'] },
  { title: "Reports", url: "/reports", icon: BarChart3, roles: ['admin', 'manager'] },
  { title: "Users", url: "/users", icon: Users, roles: ['admin'] },
  { title: "Browse Menu", url: "/browse-menu", icon: UtensilsCrossed, roles: ['customer'] },
  { title: "My Orders", url: "/my-orders", icon: ShoppingCart, roles: ['customer'] },
];

export function AppSidebar() {
  const { role } = useApp();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const filtered = items.filter(i => i.roles.includes(role));

  return (
    <Sidebar collapsible="icon" className="dark:bg-slate-950 dark:border-gray-700 dark:text-white">
      <SidebarContent className="dark:bg-slate-950 dark:text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-gray-300">{collapsed ? '🍛' : '🍛 Navigation'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filtered.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-accent/50 dark:hover:bg-gray-800 dark:text-gray-200"
                      activeClassName="bg-primary/10 text-primary font-semibold dark:bg-primary/20 dark:text-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0 dark:text-gray-300" />
                      {!collapsed && <span className="dark:text-gray-200">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
