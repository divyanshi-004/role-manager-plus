import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useState } from "react";

const categories = ['All', 'Starters', 'Main Course', 'Breads', 'Rice', 'Beverages', 'Desserts'];

export default function MenuPage() {
  const { menu, setMenu } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = activeCategory === 'All' ? menu : menu.filter(i => i.category === activeCategory);

  const toggleAvailability = (id: string) => {
    setMenu(prev => prev.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold">Menu Management</h1>
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <Badge
            key={c}
            variant={activeCategory === c ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1.5 text-sm"
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </Badge>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className={`glass-card ${!item.available ? 'opacity-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-heading font-bold text-primary">₹{item.price}</span>
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </div>
                  </div>
                  <Switch checked={item.available} onCheckedChange={() => toggleAvailability(item.id)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
