import api from "@/api/api";
import { useEffect, useState } from "react";

import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "All",
  "Starters",
  "Main Course",
  "Breads",
  "Rice",
  "Beverages",
  "Desserts",
];

export default function MenuPage() {
  const { menu, setMenu } = useApp();
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "Starters",
  });

  /* =========================
     FETCH MENU
  ==========================*/
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const res = await api.get("/menu");

      const formatted = res.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        availability: item.availability
      }));

      setMenu(formatted);
    } catch (error) {
      console.log("Menu fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER MENU
  ==========================*/
  const filtered =
    activeCategory === "All"
      ? menu
      : menu.filter((i: any) => i.category === activeCategory);

  /* =========================
     TOGGLE AVAILABILITY
  ==========================*/
  const toggleAvailability = async (id: string) => {
    try {
      const item = menu.find((i: any) => i.id === id);
      if (!item) return;

      await api.put(`/menu/${id}`, {
        availability: !item.availability,
      });

      setMenu((prev: any[]) =>
        prev.map((i) =>
          i.id === id ? { ...i, availability: !i.availability } : i
        )
      );
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  /* =========================
     ADD MENU ITEM
  ==========================*/
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Name and price are required");
      return;
    }

    try {
      const res = await api.post("/menu", {
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        category: newItem.category,
        availability: true,
      });

      const addedItem = {
        id: res.data._id,
        name: res.data.name,
        description: res.data.description,
        price: res.data.price,
        category: res.data.category,
        availability: res.data.availability,
      };

      setMenu((prev: any[]) => [addedItem, ...prev]);
      setNewItem({ name: "", description: "", price: "", category: "Starters" });
      setShowAddDialog(false);
      toast.success("Menu item added successfully!");
    } catch (err: any) {
      console.log("Add item error:", err);
      toast.error(err.response?.data?.message || "Failed to add item");
    }
  };

  /* =========================
     UI
  ==========================*/
  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">
          🍽️ Menu Management
        </h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Menu Item</DialogTitle>
              <DialogDescription>Add a new dish to your menu</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
              <Input
                placeholder="Price"
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
              <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddItem} className="w-full">
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* CATEGORY FILTER */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <Badge
            key={c}
            variant={activeCategory === c ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </Badge>
        ))}
      </div>

      {/* MENU GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item: any) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card
              className={`glass-card ${
                !item.availability ? "opacity-50" : ""
              }`}
            >
              <CardContent className="p-4">

                <div className="flex justify-between items-start">
                  <div className="flex-1">

                    <h3 className="font-heading font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-heading font-bold text-primary">
                        ₹{item.price}
                      </span>

                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>

                  </div>

                  <Switch
                    checked={item.availability}
                    onCheckedChange={() =>
                      toggleAvailability(item.id)
                    }
                  />
                </div>

              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}