import { useApp, Role } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import api from "@/api/api";

const roleBadge: Record<Role, string> = {
  admin: '👑 Admin',
  manager: '🧑‍💼 Manager',
  staff: '👨‍🍳 Staff',
  customer: '🙋 Customer',
};

export default function UsersPage() {
  const { users, setUsers } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<Role>('staff');

  const toggleActive = async (id: string) => {
    try {
      await api.put(`/users/${id}/toggle`);
      // Refresh users
      const res = await api.get("/users");
      setUsers(res.data.map((u: any) => ({ id: u._id, name: u.name, email: u.email, role: u.role, active: u.active })));
    } catch (err) {
      console.log(err);
    }
  };

  const changeRole = async (id: string, role: Role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      // Refresh users
      const res = await api.get("/users");
      setUsers(res.data.map((u: any) => ({ id: u._id, name: u.name, email: u.email, role: u.role, active: u.active })));
    } catch (err) {
      console.log(err);
    }
  };

  const addUser = async () => {
    if (!newName || !newEmail || !newPassword) return;
    try {
      await api.post("/users", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      // Refresh users
      const res = await api.get("/users");
      setUsers(res.data.map((u: any) => ({ id: u._id, name: u.name, email: u.email, role: u.role, active: u.active })));
      setNewName(''); setNewEmail(''); setNewPassword(''); setShowAdd(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Users</h1>
        <Button onClick={() => setShowAdd(!showAdd)}>
          <UserPlus className="h-4 w-4 mr-2" /> Add User
        </Button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card className="glass-card">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
              <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
              <Input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <Select value={newRole} onValueChange={v => setNewRole(v as Role)}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addUser}>Add</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-3">
        {users.map(user => (
          <motion.div key={user.id} layout>
            <Card className={`glass-card ${!user.active ? 'opacity-50' : ''}`}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-heading font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={user.role} onValueChange={v => changeRole(user.id, v as Role)}>
                    <SelectTrigger className="w-[140px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">👑 Admin</SelectItem>
                      <SelectItem value="manager">🧑‍💼 Manager</SelectItem>
                      <SelectItem value="staff">👨‍🍳 Staff</SelectItem>
                      <SelectItem value="customer">🙋 Customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant={user.active ? 'default' : 'secondary'}>{user.active ? 'Active' : 'Inactive'}</Badge>
                  <Switch checked={user.active} onCheckedChange={() => toggleActive(user.id)} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
