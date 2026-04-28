import { useApp, OrderStatus } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-info text-info-foreground',
  preparing: 'bg-warning text-warning-foreground',
  served: 'bg-success text-success-foreground',
  paid: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<OrderStatus, string> = {
  pending: '🆕 Pending',
  preparing: '🔥 Preparing',
  served: '🍽️ Served',
  paid: '💳 Paid',
};

export default function OrdersPage() {
  const { orders, advanceOrderStatus, role } = useApp();
  const canAdvance = role === 'admin' || role === 'staff';

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Orders</h1>
      <div className="grid gap-4">
        <AnimatePresence>
          {orders.map(order => (
            <motion.div key={order.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-heading font-bold">{order.id}</span>
                        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                        <span className="text-sm text-muted-foreground">Table {order.tableNumber}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-x-2">
                        {order.items.map((ci, i) => (
                          <span key={i}>{ci.item?.name || 'Unknown Item'} ×{ci.quantity}{i < order.items.length - 1 ? ',' : ''}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-heading font-semibold text-primary">₹{(order.total ?? 0).toLocaleString('en-IN')}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.round((Date.now() - order.createdAt.getTime()) / 60000)}m ago
                        </span>
                      </div>
                    </div>
                    {canAdvance && order.status !== 'served' && (
                      <Button size="sm" onClick={() => advanceOrderStatus(order.id)} className="shrink-0">
                        Advance <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
