import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role = 'admin' | 'manager' | 'staff' | 'customer';

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'served';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  available: boolean;
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
  placeOrder: (tableNumber: number, customerName?: string) => void;
  advanceOrderStatus: (orderId: string) => void;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  restockItem: (itemId: string, amount: number) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};

const MENU_DATA: MenuItem[] = [
  // Starters
  { id: 's1', name: 'Paneer Tikka', price: 249, category: 'Starters', description: 'Smoky cottage cheese cubes marinated in spices', available: true },
  { id: 's2', name: 'Hara Bhara Kebab', price: 219, category: 'Starters', description: 'Spinach and pea patties with mint chutney', available: true },
  { id: 's3', name: 'Veg Spring Rolls', price: 199, category: 'Starters', description: 'Crispy rolls stuffed with vegetables', available: true },
  { id: 's4', name: 'Dahi Ke Kebab', price: 229, category: 'Starters', description: 'Creamy hung curd kebabs with cashews', available: true },
  { id: 's5', name: 'Crispy Corn', price: 189, category: 'Starters', description: 'Spiced crispy corn kernels tossed with peppers', available: true },
  // Main Course
  { id: 'm1', name: 'Paneer Butter Masala', price: 299, category: 'Main Course', description: 'Rich creamy tomato curry with paneer', available: true },
  { id: 'm2', name: 'Dal Makhani', price: 249, category: 'Main Course', description: 'Slow-cooked black lentils in butter', available: true },
  { id: 'm3', name: 'Malai Kofta', price: 289, category: 'Main Course', description: 'Paneer-potato dumplings in creamy gravy', available: true },
  { id: 'm4', name: 'Palak Paneer', price: 269, category: 'Main Course', description: 'Spinach curry with cottage cheese', available: true },
  { id: 'm5', name: 'Chole Bhature', price: 199, category: 'Main Course', description: 'Spiced chickpeas with fried bread', available: true },
  { id: 'm6', name: 'Shahi Paneer', price: 279, category: 'Main Course', description: 'Royal paneer in cashew-cream gravy', available: true },
  { id: 'm7', name: 'Aloo Gobi', price: 199, category: 'Main Course', description: 'Spiced potato and cauliflower dry curry', available: true },
  { id: 'm8', name: 'Baingan Bharta', price: 219, category: 'Main Course', description: 'Smoky roasted eggplant mash', available: true },
  // Breads
  { id: 'b1', name: 'Butter Naan', price: 59, category: 'Breads', description: 'Soft leavened bread with butter', available: true },
  { id: 'b2', name: 'Garlic Naan', price: 79, category: 'Breads', description: 'Naan topped with garlic & coriander', available: true },
  { id: 'b3', name: 'Tandoori Roti', price: 39, category: 'Breads', description: 'Whole wheat bread from tandoor', available: true },
  { id: 'b4', name: 'Laccha Paratha', price: 69, category: 'Breads', description: 'Layered flaky flatbread', available: true },
  { id: 'b5', name: 'Missi Roti', price: 49, category: 'Breads', description: 'Spiced gram flour flatbread', available: true },
  // Rice
  { id: 'r1', name: 'Veg Biryani', price: 279, category: 'Rice', description: 'Fragrant basmati rice with seasonal vegetables', available: true },
  { id: 'r2', name: 'Veg Pulao', price: 199, category: 'Rice', description: 'Aromatic rice with mixed vegetables', available: true },
  { id: 'r3', name: 'Jeera Rice', price: 149, category: 'Rice', description: 'Cumin-tempered basmati rice', available: true },
  { id: 'r4', name: 'Paneer Fried Rice', price: 229, category: 'Rice', description: 'Indo-Chinese fried rice with paneer', available: true },
  // Beverages
  { id: 'bv1', name: 'Masala Chai', price: 49, category: 'Beverages', description: 'Spiced Indian tea', available: true },
  { id: 'bv2', name: 'Mango Lassi', price: 99, category: 'Beverages', description: 'Sweet yogurt mango smoothie', available: true },
  { id: 'bv3', name: 'Fresh Lime Soda', price: 79, category: 'Beverages', description: 'Refreshing lime with soda', available: true },
  { id: 'bv4', name: 'Cold Coffee', price: 129, category: 'Beverages', description: 'Iced coffee with cream', available: true },
  // Desserts
  { id: 'd1', name: 'Gulab Jamun', price: 99, category: 'Desserts', description: 'Deep-fried milk dumplings in syrup', available: true },
  { id: 'd2', name: 'Rasmalai', price: 129, category: 'Desserts', description: 'Soft paneer discs in saffron milk', available: true },
  { id: 'd3', name: 'Kulfi', price: 89, category: 'Desserts', description: 'Traditional Indian ice cream', available: true },
];

const INVENTORY_DATA: InventoryItem[] = [
  { id: 'i1', name: 'Paneer', stock: 3, unit: 'kg', minStock: 4, category: 'Dairy' },
  { id: 'i2', name: 'Basmati Rice', stock: 15, unit: 'kg', minStock: 10, category: 'Grains' },
  { id: 'i3', name: 'Wheat Flour', stock: 12, unit: 'kg', minStock: 8, category: 'Grains' },
  { id: 'i4', name: 'Tomatoes', stock: 4, unit: 'kg', minStock: 5, category: 'Vegetables' },
  { id: 'i5', name: 'Onions', stock: 6, unit: 'kg', minStock: 8, category: 'Vegetables' },
  { id: 'i6', name: 'Spinach', stock: 1, unit: 'kg', minStock: 3, category: 'Vegetables' },
  { id: 'i7', name: 'Potatoes', stock: 10, unit: 'kg', minStock: 8, category: 'Vegetables' },
  { id: 'i8', name: 'Cauliflower', stock: 3, unit: 'kg', minStock: 4, category: 'Vegetables' },
  { id: 'i9', name: 'Cream', stock: 3, unit: 'ltr', minStock: 4, category: 'Dairy' },
  { id: 'i10', name: 'Butter', stock: 2, unit: 'kg', minStock: 3, category: 'Dairy' },
  { id: 'i11', name: 'Yogurt', stock: 5, unit: 'ltr', minStock: 4, category: 'Dairy' },
  { id: 'i12', name: 'Cashews', stock: 2, unit: 'kg', minStock: 3, category: 'Dry Fruits' },
  { id: 'i13', name: 'Cooking Oil', stock: 8, unit: 'ltr', minStock: 5, category: 'Essentials' },
  { id: 'i14', name: 'Garam Masala', stock: 1, unit: 'kg', minStock: 2, category: 'Spices' },
  { id: 'i15', name: 'Red Chili Powder', stock: 2, unit: 'kg', minStock: 2, category: 'Spices' },
  { id: 'i16', name: 'Gram Flour', stock: 4, unit: 'kg', minStock: 3, category: 'Grains' },
];

const USERS_DATA: User[] = [
  { id: 'u1', name: 'Arjun Sharma', email: 'arjun@restaurant.com', role: 'admin', active: true },
  { id: 'u2', name: 'Priya Patel', email: 'priya@restaurant.com', role: 'manager', active: true },
  { id: 'u3', name: 'Ravi Kumar', email: 'ravi@restaurant.com', role: 'staff', active: true },
  { id: 'u4', name: 'Sneha Gupta', email: 'sneha@restaurant.com', role: 'staff', active: true },
  { id: 'u5', name: 'Amit Singh', email: 'amit@restaurant.com', role: 'customer', active: true },
];

const SAMPLE_ORDERS: Order[] = [
  { id: 'ORD-001', items: [{ item: MENU_DATA[5], quantity: 2 }, { item: MENU_DATA[18], quantity: 4 }], total: 834, status: 'preparing', tableNumber: 3, createdAt: new Date(Date.now() - 1200000) },
  { id: 'ORD-002', items: [{ item: MENU_DATA[0], quantity: 1 }, { item: MENU_DATA[22], quantity: 1 }], total: 478, status: 'placed', tableNumber: 7, createdAt: new Date(Date.now() - 600000) },
  { id: 'ORD-003', items: [{ item: MENU_DATA[7], quantity: 1 }, { item: MENU_DATA[24], quantity: 2 }], total: 517, status: 'ready', tableNumber: 1, createdAt: new Date(Date.now() - 1800000) },
  { id: 'ORD-004', items: [{ item: MENU_DATA[1], quantity: 2 }, { item: MENU_DATA[26], quantity: 2 }], total: 636, status: 'placed', tableNumber: 5, createdAt: new Date(Date.now() - 300000) },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>('admin');
  const [isDark, setIsDark] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>(MENU_DATA);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY_DATA);
  const [users, setUsers] = useState<User[]>(USERS_DATA);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(p => !p);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => setCart(prev => prev.filter(c => c.item.id !== itemId));

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(itemId);
    setCart(prev => prev.map(c => c.item.id === itemId ? { ...c, quantity: qty } : c));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (tableNumber: number, customerName?: string) => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      items: [...cart],
      total: cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0),
      status: 'placed',
      tableNumber,
      createdAt: new Date(),
      customerName,
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const advanceOrderStatus = (orderId: string) => {
    const flow: OrderStatus[] = ['placed', 'preparing', 'ready', 'served'];
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const idx = flow.indexOf(o.status);
      if (idx < flow.length - 1) return { ...o, status: flow[idx + 1] };
      return o;
    }));
  };

  const restockItem = (itemId: string, amount: number) => {
    setInventory(prev => prev.map(i => i.id === itemId ? { ...i, stock: i.stock + amount } : i));
  };

  return (
    <AppContext.Provider value={{
      role, setRole, isDark, toggleTheme,
      menu, setMenu, cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      orders, placeOrder, advanceOrderStatus,
      inventory, setInventory, restockItem,
      users, setUsers,
    }}>
      {children}
    </AppContext.Provider>
  );
};
