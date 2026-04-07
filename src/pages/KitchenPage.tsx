import { useApp, OrderStatus } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const columns: { status: OrderStatus; label: string; emoji: string }[] = [
  { status: 'placed', label: 'New Orders', emoji: '🆕' },
  { status: 'preparing', label: 'Preparing', emoji: '🔥' },
  { status: 'ready', label: 'Ready to Serve', emoji: '✅' },
];

const colBorder: Record<string, string> = {
  placed: 'border-t-info',
  preparing: 'border-t-warning',
  ready: 'border-t-success',
};

export default function KitchenPage() {
  const { orders, advanceOrderStatus } = useApp();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">👨‍🍳 Kitchen Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => {
          const colOrders = orders.filter(o => o.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{col.emoji}</span>
                <h2 className="font-heading font-semibold">{col.label}</h2>
                <Badge variant="secondary" className="ml-auto">{colOrders.length}</Badge>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {colOrders.map(order => (
                  <motion.div
                    key={order.id}
                    layout
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => advanceOrderStatus(order.id)}
                    className="cursor-pointer"
                  >
                    <Card className={`glass-card border-t-4 ${colBorder[col.status]} hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-heading font-bold">{order.id}</span>
                          <Badge variant="outline">Table {order.tableNumber}</Badge>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((ci, i) => (
                            <p key={i} className="text-sm">{ci.item.name} <span className="text-muted-foreground">×{ci.quantity}</span></p>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">Tap to advance →</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                {colOrders.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border rounded-lg">
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
