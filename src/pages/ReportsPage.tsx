import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "@/api/api";

const COLORS = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow/Orange
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
];

export default function ReportsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  /* ===============================
     FETCH DATA
  ===============================*/
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billRes, orderRes] = await Promise.all([
        api.get("/bills"),
        api.get("/orders"),
      ]);

      setBills(billRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===============================
     REAL REVENUE
  ===============================*/
  const totalRevenue = bills
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const avgOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  const ordersPerDay =
    orders.length > 0
      ? Math.round(orders.length / 30)
      : 0;

  const tableTurnover = (orders.length / 10).toFixed(1);

  /* ===============================
     CATEGORY REVENUE (REAL LOGIC)
  ===============================*/
  const categoryMap: Record<string, number> = {};

  bills.forEach((bill) => {
    const order = bill.order;
    if (!order?.items) return;

    order.items.forEach((item: any) => {
      const category =
        item.menuItem?.category || "Unknown";

      const price =
        item.menuItem?.price || 0;

      const revenue = price * item.quantity;

      categoryMap[category] =
        (categoryMap[category] || 0) + revenue;
    });
  });

  const categoryRevenue = Object.keys(categoryMap).map(
    (key) => ({
      name: key,
      value: categoryMap[key],
    })
  );

  /* ===============================
     MONTHLY MOCK (CAN BE REAL LATER)
  ===============================*/
  const monthlyData = [
    { month: "Jan", revenue: totalRevenue * 0.7 },
    { month: "Feb", revenue: totalRevenue * 0.8 },
    { month: "Mar", revenue: totalRevenue * 0.9 },
    { month: "Apr", revenue: totalRevenue * 1.1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-heading font-bold">
        Reports
      </h1>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">
              Revenue by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryRevenue.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number) =>
                    `₹${v.toLocaleString("en-IN")}`
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-heading">
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue">
                  {monthlyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ================= METRICS ================= */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-heading">
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Revenue",
                value: `₹${totalRevenue.toLocaleString(
                  "en-IN"
                )}`,
              },
              {
                label: "Avg Order Value",
                value: `₹${avgOrderValue.toFixed(0)}`,
              },
              {
                label: "Orders / Day",
                value: ordersPerDay,
              },
              {
                label: "Table Turnover",
                value: `${tableTurnover}x`,
              },
            ].map((m, i) => (
              <div
                key={i}
                className="text-center p-4 rounded-lg bg-muted/50"
              >
                <p className="text-2xl font-heading font-bold">
                  {m.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}