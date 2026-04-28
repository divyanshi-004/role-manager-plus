import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Flame, UtensilsCrossed } from "lucide-react";

type OrderStatus = "pending" | "preparing" | "served" | "paid";

const statusConfig: Record<OrderStatus, { icon: any; label: string; color: string }> = {
  pending: { icon: Clock, label: "Order Placed", color: "text-info" },
  preparing: { icon: Flame, label: "Being Prepared", color: "text-warning" },
  served: { icon: UtensilsCrossed, label: "Served", color: "text-muted-foreground" },
  paid: { icon: CheckCircle2, label: "Completed", color: "text-success" }
};

const steps: OrderStatus[] = ["pending", "preparing", "served", "paid"];

export default function MyOrdersPage() {
  const { orders } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">📋 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No orders yet</p>
          <p className="text-sm">Place an order from menu!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const cfg = statusConfig[order.status];
            const stepIdx = steps.indexOf(order.status);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-4 space-y-4">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        Order #{order.id.slice(-5)}
                      </span>

                      <Badge className="flex items-center gap-1">
                        <cfg.icon className={`h-3 w-3 ${cfg.color}`} />
                        {cfg.label}
                      </Badge>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-1">
                      {steps.map((s, i) => (
                        <div
                          key={s}
                          className={`h-2 flex-1 rounded-full ${
                            i <= stepIdx ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Items */}
                    <div className="text-sm space-y-1">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.item?.name} × {item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            ₹{(item.item?.price * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm text-muted-foreground">
                        Table {order.tableNumber}
                      </span>

                      <span className="font-bold text-primary">
                        ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>

                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}