import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { IndianRupee, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";

const revenueData = [
  { day: 'Mon', revenue: 12400 }, { day: 'Tue', revenue: 15600 },
  { day: 'Wed', revenue: 11200 }, { day: 'Thu', revenue: 18900 },
  { day: 'Fri', revenue: 22100 }, { day: 'Sat', revenue: 28500 },
  { day: 'Sun', revenue: 24300 },
];

const peakHours = [
  { hour: '11AM', orders: 8 }, { hour: '12PM', orders: 22 }, { hour: '1PM', orders: 28 },
  { hour: '2PM', orders: 15 }, { hour: '3PM', orders: 6 }, { hour: '4PM', orders: 4 },
  { hour: '5PM', orders: 5 }, { hour: '6PM', orders: 9 }, { hour: '7PM', orders: 18 },
  { hour: '8PM', orders: 32 }, { hour: '9PM', orders: 26 }, { hour: '10PM', orders: 14 },
];

const topItems = [
  { name: 'Paneer Butter Masala', orders: 142 },
  { name: 'Veg Biryani', orders: 128 },
  { name: 'Paneer Tikka', orders: 98 },
  { name: 'Dal Makhani', orders: 87 },
];

const leastItems = [
  { name: 'Missi Roti', orders: 12 },
  { name: 'Tandoori Roti', orders: 18 },
  { name: 'Kulfi', orders: 22 },
];

const combos = [
  { combo: 'Paneer Butter Masala + Garlic Naan + Lassi', saves: '₹45' },
  { combo: 'Veg Biryani + Raita + Cold Coffee', saves: '₹35' },
  { combo: 'Paneer Tikka + Dal Makhani + Naan', saves: '₹55' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { orders } = useApp();
  const todayRevenue = orders.reduce((s, o) => s + o.total, 0);
  const activeOrders = orders.filter(o => o.status !== 'served').length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-primary' },
          { label: 'Active Orders', value: activeOrders, icon: ShoppingCart, color: 'text-info' },
          { label: 'Weekly Growth', value: '+18%', icon: TrendingUp, color: 'text-success' },
          { label: 'Guests Today', value: '47', icon: Users, color: 'text-accent' },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-heading font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-heading">Weekly Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader><CardTitle className="font-heading">Peak Hours</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={peakHours}>
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--accent))' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="font-heading text-base">🔥 Top Sellers</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {topItems.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{t.name}</span>
                  <Badge variant="secondary">{t.orders} orders</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="font-heading text-base">📉 Least Selling</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {leastItems.map((t, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{t.name}</span>
                  <Badge variant="outline">{t.orders} orders</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card h-full">
            <CardHeader><CardTitle className="font-heading text-base">💡 Combo Ideas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {combos.map((c, i) => (
                <div key={i} className="p-2 rounded-md bg-primary/5 border border-primary/10">
                  <p className="text-xs">{c.combo}</p>
                  <p className="text-xs font-semibold text-primary mt-1">Save {c.saves}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
