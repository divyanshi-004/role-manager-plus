import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertTriangle, Package, Plus } from "lucide-react";

function getStockStatus(item: { stock: number; minStock: number }) {
  if (item.stock <= item.minStock * 0.5) return { label: '⚠️ Critical', variant: 'destructive' as const };
  if (item.stock <= item.minStock) return { label: '⚡ Low', variant: 'default' as const };
  return { label: '✅ OK', variant: 'secondary' as const };
}

export default function InventoryPage() {
  const { inventory, restockItem } = useApp();
  const critical = inventory.filter(i => i.stock <= i.minStock * 0.5);
  const low = inventory.filter(i => i.stock > i.minStock * 0.5 && i.stock <= i.minStock);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Inventory</h1>

      {(critical.length > 0 || low.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {critical.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" /> Critical Stock ({critical.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {critical.map(i => (
                  <div key={i.id} className="flex items-center justify-between">
                    <span className="text-sm">{i.name} — {i.stock}{i.unit}</span>
                    <Button size="sm" variant="destructive" onClick={() => restockItem(i.id, i.minStock * 2)}>
                      <Plus className="h-3 w-3 mr-1" /> Restock
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {low.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-heading flex items-center gap-2">
                  <Package className="h-4 w-4 text-warning" /> Low Stock ({low.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {low.map(i => (
                  <div key={i.id} className="flex items-center justify-between">
                    <span className="text-sm">{i.name} — {i.stock}{i.unit}</span>
                    <Button size="sm" variant="outline" onClick={() => restockItem(i.id, i.minStock)}>
                      <Plus className="h-3 w-3 mr-1" /> Restock
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map(item => {
          const status = getStockStatus(item);
          return (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-heading font-bold">{item.stock}<span className="text-sm text-muted-foreground ml-1">{item.unit}</span></p>
                      <p className="text-xs text-muted-foreground">Min: {item.minStock}{item.unit}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => restockItem(item.id, 5)}>
                      <Plus className="h-3 w-3 mr-1" /> Add 5
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
