import { useEffect, useState } from "react";
import api from "@/api/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

/* ✅ FIX: match backend exactly */
type OrderStatus = "pending" | "preparing" | "served";

const columns: { status: OrderStatus; label: string; emoji: string }[] = [
  { status: "pending", label: "New Orders", emoji: "🆕" },
  { status: "preparing", label: "Preparing", emoji: "🔥" },
  { status: "served", label: "Ready to Serve", emoji: "✅" },
];

const colBorder: Record<OrderStatus, string> = {
  pending: "border-t-yellow-500",
  preparing: "border-t-blue-500",
  served: "border-t-green-500",
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<any[]>([]);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.log("FETCH ORDERS ERROR:", err);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id: string, status: OrderStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err: any) {
      console.log(
        "UPDATE STATUS ERROR:",
        err?.response?.data || err.message
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">
        👨‍🍳 Kitchen Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {columns.map((col) => {
          const colOrders = orders.filter(
            (o) => o.status === col.status
          );

          return (
            <div key={col.status} className="space-y-3">

              {/* HEADER */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{col.emoji}</span>
                <h2 className="font-heading font-semibold">
                  {col.label}
                </h2>
                <Badge className="ml-auto">
                  {colOrders.length}
                </Badge>
              </div>

              {/* ORDERS */}
              <div className="space-y-3 min-h-[200px]">

                {colOrders.map((order) => (
                  <motion.div
                    key={order._id}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`glass-card border-t-4 ${
                        colBorder[col.status]
                      }`}
                    >
                      <CardContent className="p-4 space-y-2">

                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">
                            Order #{order._id.slice(-5)}
                          </span>

                          <Badge variant="outline">
                            Table {order.tableNumber}
                          </Badge>
                        </div>

                        {/* ITEMS */}
                        <div className="space-y-1 text-sm">
                          {order.items.map((item: any, i: number) => (
                            <p key={i}>
                              {item.menuItem?.name} × {item.quantity}
                            </p>
                          ))}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-2 flex-wrap">

                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                updateStatus(order._id, "preparing")
                              }
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                            >
                              Start Cooking
                            </button>
                          )}

                          {order.status === "preparing" && (
                            <button
                              onClick={() =>
                                updateStatus(order._id, "served")
                              }
                              className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                            >
                              Mark Ready
                            </button>
                          )}

                        </div>

                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {/* EMPTY */}
                {colOrders.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-lg">
                    No orders
                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}