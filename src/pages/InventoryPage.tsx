import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { AlertTriangle, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/api/api";

function getStockStatus(item: { stock: number; minStock: number }) {
  if (item.stock <= item.minStock * 0.5)
    return { label: "⚠️ Critical", variant: "destructive" as const };
  if (item.stock <= item.minStock)
    return { label: "⚡ Low", variant: "default" as const };
  return { label: "✅ OK", variant: "secondary" as const };
}

export default function InventoryPage() {
  const { restockItem } = useApp();

  const [inventory, setInventory] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    stock: "",
    unit: "pcs",
    minStock: "",
    category: "general",
  });

  /* ================= FETCH INVENTORY ================= */
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setInventory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= RESTOCK ================= */
  const handleRestock = async (id: string, amount: number) => {
    try {
      await api.put(`/inventory/${id}/restock`, {
        amount,
      });

      fetchInventory(); // refresh after update
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= ADD ITEM ================= */
  const handleAddItem = async () => {
    try {
      await api.post("/inventory", {
        name: newItem.name,
        stock: parseInt(newItem.stock),
        unit: newItem.unit,
        minStock: parseInt(newItem.minStock),
        category: newItem.category,
      });

      setNewItem({
        name: "",
        stock: "",
        unit: "pcs",
        minStock: "",
        category: "general",
      });
      setIsAddDialogOpen(false);
      fetchInventory();
    } catch (err) {
      console.log(err);
    }
  };

  const critical = inventory.filter(
    (i) => i.stock <= i.minStock * 0.5
  );

  const low = inventory.filter(
    (i) =>
      i.stock > i.minStock * 0.5 && i.stock <= i.minStock
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading font-bold">
          Inventory
        </h1>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
              <DialogDescription>
                Add a new item to your inventory with details like stock, unit, and minimum stock level.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Tomatoes"
                />
              </div>
              <div>
                <Label htmlFor="stock">Initial Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                  placeholder="e.g., 50"
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="liters">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minStock">Min Stock</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newItem.minStock}
                  onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ALERT BOXES */}
      {(critical.length > 0 || low.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {critical.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Critical Stock ({critical.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {critical.map((i) => (
                  <div
                    key={i._id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {i.name} — {i.stock}
                      {i.unit}
                    </span>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleRestock(i._id, i.minStock * 2)
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Restock
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {low.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-warning" />
                  Low Stock ({low.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {low.map((i) => (
                  <div
                    key={i._id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {i.name} — {i.stock}
                      {i.unit}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleRestock(i._id, i.minStock)
                      }
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Restock
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const status = getStockStatus(item);

          return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-semibold">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>

                    <Badge variant={status.variant}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="mt-3 flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-heading font-bold">
                        {item.stock}
                        <span className="text-sm text-muted-foreground ml-1">
                          {item.unit}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Min: {item.minStock}
                        {item.unit}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRestock(item._id, 5)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add 5
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