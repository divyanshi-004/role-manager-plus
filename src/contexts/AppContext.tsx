import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import api from "../api/api";
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

export type Role = "admin" | "manager" | "staff" | "customer";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "served"
  | "paid";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  availability: boolean;
  image?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  tableNumber: number;
  createdAt: Date;
  customerName?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  category: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

/* ================= CONTEXT ================= */

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;

  isDark: boolean;
  toggleTheme: () => void;

  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;

  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;

  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  placeOrder: (tableNumber: number, customerName?: string) => Promise<boolean>;
  advanceOrderStatus: (orderId: string) => Promise<void>;

  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  restockItem: (itemId: string, amount: number) => void;

  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

/* ================= PROVIDER ================= */

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [role, setRole] = useState<Role>(user?.role as Role || "admin");
  const [isDark, setIsDark] = useState(false);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  /* ================= THEME ================= */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark((p) => !p);

  /* ================= UTILITIES ================= */

  const mapBackendStatusToFrontend = (backendStatus: string): OrderStatus => {
    switch (backendStatus) {
      case 'placed':
      case 'pending':
        return 'pending';
      case 'preparing':
        return 'preparing';
      case 'ready':
      case 'served':
        return 'served';
      case 'completed':
      case 'paid':
        return 'paid';
      default:
        return 'pending';
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (user?.role) {
      setRole(user.role as Role);
    }

    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      // Load menu for everyone
      const menuRes = await api.get("/menu");
      setMenu(
        menuRes.data.map((m: any) => ({
          id: m._id,
          ...m,
        }))
      );

      // Load orders for authenticated users
      try {
        const orderRes = await api.get("/orders");
        setOrders(
          orderRes.data.map((o: any) => ({
            id: o._id,
            items: o.items.map((item: any) => ({
              item: item.menuItem,
              quantity: item.quantity,
            })),
            total: o.totalAmount || 0,
            status: mapBackendStatusToFrontend(o.status),
            tableNumber: o.tableNumber,
            createdAt: new Date(o.createdAt),
            customerName: o.customerName,
          }))
        );
      } catch (orderErr) {
        console.log("Orders not accessible for this role");
        setOrders([]);
      }

      // Load inventory only for admin/manager
      if (user?.role === 'admin' || user?.role === 'manager') {
        try {
          const inventoryRes = await api.get("/inventory");
          setInventory(
            inventoryRes.data.map((i: any) => ({
              id: i._id,
              ...i,
            }))
          );
        } catch (inventoryErr) {
          console.log("Inventory not accessible for this role");
          setInventory([]);
        }
      }

      // Load users only for admin
      if (user?.role === 'admin') {
        try {
          const userRes = await api.get("/users");
          setUsers(
            userRes.data.map((u: any) => ({
              id: u._id,
              name: u.name,
              email: u.email,
              role: u.role,
              active: true,
            }))
          );
        } catch (userErr) {
          console.log("Users not accessible for this role");
          setUsers([]);
        }
      }

    } catch (err) {
      console.log("Failed to load some data", err);
    }
  };

  /* ================= CART ================= */

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);

      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }

      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) =>
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(itemId);

    setCart((prev) =>
      prev.map((c) =>
        c.item.id === itemId ? { ...c, quantity: qty } : c
      )
    );
  };

  const clearCart = () => setCart([]);

  /* ================= PLACE ORDER ================= */

  const placeOrder = async (
    tableNumber: number,
    customerName?: string
  ): Promise<boolean> => {
    if (cart.length === 0) return false;

    try {
      const payload = {
        tableNumber,
        customerName,
        items: cart.map((c) => ({
          menuItem: c.item.id,
          quantity: c.quantity,
        })),
      };

      const res = await api.post("/orders", payload);
      const createdOrder = res.data.order ?? res.data;

      const newOrder: Order = {
        id: createdOrder._id,
        items: cart,
        total: createdOrder.totalAmount,
        status: mapBackendStatusToFrontend(createdOrder.status),
        tableNumber,
        createdAt: new Date(createdOrder.createdAt),
        customerName,
      };

      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      return true;
    } catch (err: any) {
      console.error("Order failed:", err.response?.data || err.message);
      return false;
    }
  };

  const advanceOrderStatus = async (orderId: string) => {
    try {
      // Find the current order to determine next status
      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder) return;

      let nextStatus: string;
      switch (currentOrder.status) {
        case 'pending':
          nextStatus = 'preparing';
          break;
        case 'preparing':
          nextStatus = 'served';
          break;
        default:
          return; // Cannot advance further
      }

      const res = await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      const updatedOrder = res.data;

      // Map backend status to frontend status
      let frontendStatus: OrderStatus;
      switch (updatedOrder.status) {
        case 'placed':
          frontendStatus = 'pending';
          break;
        case 'preparing':
          frontendStatus = 'preparing';
          break;
        case 'ready':
        case 'served':
          frontendStatus = 'served';
          break;
        case 'completed':
          frontendStatus = 'paid';
          break;
        default:
          frontendStatus = 'pending';
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: frontendStatus } : order
        )
      );
    } catch (err: any) {
      console.error("Failed to advance order status:", err.response?.data || err.message);
    }
  };

  /* ================= INVENTORY ================= */

  const restockItem = (itemId: string, amount: number) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, stock: i.stock + amount } : i
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isDark,
        toggleTheme,

        menu,
        setMenu,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        orders,
        setOrders,
        placeOrder,
        advanceOrderStatus,

        inventory,
        setInventory,
        restockItem,

        users,
        setUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};