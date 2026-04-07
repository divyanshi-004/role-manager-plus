import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const categoryRevenue = [
  { name: 'Main Course', value: 45600 },
  { name: 'Starters', value: 22300 },
  { name: 'Rice', value: 18400 },
  { name: 'Beverages', value: 8900 },
  { name: 'Breads', value: 6200 },
  { name: 'Desserts', value: 5100 },
];

const COLORS = [
  'hsl(28, 85%, 52%)', 'hsl(16, 75%, 48%)', 'hsl(38, 92%, 50%)',
  'hsl(210, 80%, 55%)', 'hsl(142, 71%, 45%)', 'hsl(330, 80%, 60%)',
];

const monthlyData = [
  { month: 'Jan', revenue: 280000, orders: 820 },
  { month: 'Feb', revenue: 310000, orders: 890 },
  { month: 'Mar', revenue: 345000, orders: 970 },
  { month: 'Apr', revenue: 290000, orders: 840 },
];

export default function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="font-heading">Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryRevenue} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader><CardTitle className="font-heading">Monthly Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle className="font-heading">Key Metrics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg Order Value', value: '₹385' },
              { label: 'Orders/Day', value: '32' },
              { label: 'Table Turnover', value: '4.2x' },
              { label: 'Customer Rating', value: '4.6 ★' },
            ].map((m, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-heading font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
