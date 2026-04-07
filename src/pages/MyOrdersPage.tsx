import { useApp, OrderStatus } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Flame, UtensilsCrossed } from "lucide-react";

const statusConfig: Record<OrderStatus, { icon: React.ElementType; label: string; color: string }> = {
  placed: { icon: Clock, label: 'Order Placed', color: 'text-info' },
  preparing: { icon: Flame, label: 'Being Prepared', color: 'text-warning' },
  ready: { icon: CheckCircle2, label: 'Ready to Serve', color: 'text-success' },
  served: { icon: UtensilsCrossed, label: 'Served', color: 'text-muted-foreground' },
};

const steps: OrderStatus[] = ['placed', 'preparing', 'ready', 'served'];

export default function MyOrdersPage() {
  const { orders } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">📋 My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No orders yet</p>
          <p className="text-sm">Browse the menu to place your first order!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const cfg = statusConfig[order.status];
            const stepIdx = steps.indexOf(order.status);
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="glass-card">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold">{order.id}</span>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <cfg.icon className={`h-3 w-3 ${cfg.color}`} />
                        {cfg.label}
                      </Badge>
                    </div>

                    {/* Progress tracker */}
                    <div className="flex items-center gap-1">
                      {steps.map((s, i) => (
                        <div key={s} className="flex-1 flex items-center">
                          <div className={`h-2 flex-1 rounded-full ${i <= stepIdx ? 'bg-primary' : 'bg-muted'} transition-colors`} />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      {steps.map(s => <span key={s}>{statusConfig[s].label}</span>)}
                    </div>

                    <div className="text-sm space-y-1">
                      {order.items.map((ci, i) => (
                        <div key={i} className="flex justify-between">
                          <span>{ci.item.name} ×{ci.quantity}</span>
                          <span className="text-muted-foreground">₹{(ci.item.price * ci.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-2">
                      <span className="text-sm text-muted-foreground">Table {order.tableNumber}</span>
                      <span className="font-heading font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</span>
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
