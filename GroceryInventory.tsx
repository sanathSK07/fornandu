import { useState } from "react";
import { MoreHorizontal, Plus, Apple, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useGroceryItems } from "@/hooks/useFirestore";
import { AddGroceryDialog } from "./AddGroceryDialog";

export default function GroceryInventory() {
  const { data: groceryItems, deleteItem, updateItem } = useGroceryItems();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const getExpiryStatus = (expiryDate: Date | null) => {
    if (!expiryDate) return { text: "No expiry date", color: "bg-gray-500" };
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { text: "Expired", color: "bg-red-500" };
    } else if (daysUntilExpiry === 0) {
      return { text: "Expires today", color: "bg-red-500" };
    } else if (daysUntilExpiry === 1) {
      return { text: "Expires tomorrow", color: "bg-amber-500" };
    } else if (daysUntilExpiry <= 3) {
      return { text: `Expires in ${daysUntilExpiry} days`, color: "bg-red-500" };
    } else if (daysUntilExpiry <= 7) {
      return { text: `Fresh (${daysUntilExpiry} days left)`, color: "bg-green-500" };
    } else {
      return { text: `Fresh (${daysUntilExpiry} days left)`, color: "bg-green-500" };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'fruits':
        return <Apple className="text-red-500" />;
      case 'vegetables':
        return <span className="text-green-500">🥬</span>;
      case 'dairy':
        return <span className="text-yellow-500">🧀</span>;
      case 'meat':
        return <span className="text-red-600">🥩</span>;
      case 'grains':
        return <span className="text-amber-600">🌾</span>;
      default:
        return <Package className="text-gray-500" />;
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingItem(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Pantry</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {groceryItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No grocery items yet</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add your first item
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {groceryItems.slice(0, 5).map((item) => {
                const expiryStatus = getExpiryStatus(item.expiryDate);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(item.category || '')}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                          <span>{item.quantity} {item.unit}</span>
                          <span>•</span>
                          <Badge variant="secondary" className={`text-white ${expiryStatus.color}`}>
                            {expiryStatus.text}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
              
              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add new item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddGroceryDialog
        open={showAddDialog}
        onClose={handleCloseDialog}
        editingItem={editingItem}
      />
    </>
  );
}
