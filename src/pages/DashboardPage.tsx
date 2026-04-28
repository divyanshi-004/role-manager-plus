import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/api/api";

/* ===============================
   STATIC UI DATA (KEEP AS PLACEHOLDERS)
================================*/
const peakHours = [
  { hour: "11AM", orders: 8 },
  { hour: "12PM", orders: 22 },
  { hour: "1PM", orders: 28 },
  { hour: "2PM", orders: 15 },
  { hour: "3PM", orders: 6 },
  { hour: "4PM", orders: 4 },
  { hour: "5PM", orders: 5 },
  { hour: "6PM", orders: 9 },
  { hour: "7PM", orders: 18 },
  { hour: "8PM", orders: 32 },
  { hour: "9PM", orders: 26 },
  { hour: "10PM", orders: 14 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { orders } = useApp();

  const [bills, setBills] = useState<any[]>([]);

  /* ===============================
     FETCH BILLS (REAL REVENUE SOURCE)
  ===============================*/
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get("/bills");
      setBills(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===============================
     REAL CALCULATIONS
  ===============================*/

  const todayRevenue = bills
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const activeOrders = orders.filter(
    (o) => o.status !== "served"
  ).length;

  const totalGuests = orders.length;

  /* ===============================
     STATIC MOCK (KEEP FOR NOW)
  ===============================*/
  const revenueData = [
    { day: "Mon", revenue: todayRevenue * 0.6 },
    { day: "Tue", revenue: todayRevenue * 0.7 },
    { day: "Wed", revenue: todayRevenue * 0.5 },
    { day: "Thu", revenue: todayRevenue * 0.8 },
    { day: "Fri", revenue: todayRevenue * 1.1 },
    { day: "Sat", revenue: todayRevenue * 1.3 },
    { day: "Sun", revenue: todayRevenue * 1.0 },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <h1 className="text-2xl font-heading font-bold">
        Dashboard
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Revenue",
            value: `₹${todayRevenue.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "text-primary",
          },
          {
            label: "Active Orders",
            value: activeOrders,
            icon: ShoppingCart,
            color: "text-info",
          },
          {
            label: "Total Orders",
            value: orders.length,
            icon: TrendingUp,
            color: "text-success",
          },
          {
            label: "Guests Served",
            value: totalGuests,
            icon: Users,
            color: "text-accent",
          },
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-heading font-bold mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <stat.icon
                    className={`h-8 w-8 ${stat.color} opacity-70`}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-heading">
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="font-heading">
                Peak Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={peakHours}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}