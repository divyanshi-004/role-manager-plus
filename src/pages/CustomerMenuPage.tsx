import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const categories = ['All', 'Starters', 'Main Course', 'Breads', 'Rice', 'Beverages', 'Desserts'];

export default function CustomerMenuPage() {
  const { menu, cart, addToCart, removeFromCart, updateCartQuantity, placeOrder, clearCart } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const navigate = useNavigate();

  const filtered = (activeCategory === 'All' ? menu : menu.filter(i => i.category === activeCategory)).filter(i => i.availability);
  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const handlePlaceOrder = async () => {
    const table = parseInt(tableNumber);
    if (!table || table < 1) {
      toast.error('Enter a valid table number');
      return;
    }

    const success = await placeOrder(table);

    if (!success) {
      toast.error('Order failed. Please try again.');
      return;
    }

    setShowCart(false);
    setTableNumber('');
    toast.success('Order placed successfully! 🎉');
    navigate('/my-orders');
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">🍛 Our Menu</h1>
        <Button variant="outline" className="relative" onClick={() => setShowCart(!showCart)}>
          <ShoppingCart className="h-4 w-4 mr-2" /> Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Button>
      </div>

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

      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="glass-card border-primary/30">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-heading font-bold">🛒 Your Cart</h3>
                {cart.map(ci => (
                  <div key={ci.item.id} className="flex items-center justify-between gap-2">
                    <span className="text-sm flex-1">{ci.item.name}</span>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateCartQuantity(ci.item.id, ci.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-6 text-center text-sm font-semibold">{ci.quantity}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateCartQuantity(ci.item.id, ci.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                      <span className="text-sm font-heading w-16 text-right">₹{(ci.item.price * ci.quantity).toLocaleString('en-IN')}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(ci.item.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-heading font-bold text-lg">Total: ₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex gap-3">
                  <Input placeholder="Table Number" value={tableNumber} onChange={e => setTableNumber(e.target.value)} className="w-32" type="number" />
                  <Button onClick={handlePlaceOrder} className="flex-1"><Send className="h-4 w-4 mr-2" /> Place Order</Button>
                  <Button variant="ghost" onClick={clearCart}>Clear</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }}>
            <Card className="glass-card overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="font-heading font-bold text-lg text-primary">₹{item.price}</span>
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => { addToCart(item); toast.success(`${item.name} added!`); }}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {cartCount > 0 && !showCart && (
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
        >
          <Button onClick={() => setShowCart(true)} className="shadow-lg glow-primary px-6 py-3 text-base">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartCount} items — ₹{cartTotal.toLocaleString('en-IN')}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
