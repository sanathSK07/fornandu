import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useShoppingList } from "@/hooks/useFirestore";

export default function ShoppingList() {
  const { data: shoppingItems, addItem, updateItem, deleteItem } = useShoppingList();
  const [newItemName, setNewItemName] = useState("");

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await addItem({
        name: newItemName.trim(),
        quantity: "",
        isCompleted: false,
        priority: 0,
      });
      setNewItemName("");
    } catch (error) {
      console.error("Error adding shopping item:", error);
    }
  };

  const handleToggleCompleted = async (id: string, isCompleted: boolean) => {
    try {
      await updateItem(id, { isCompleted });
    } catch (error) {
      console.error("Error updating shopping item:", error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (error) {
      console.error("Error removing shopping item:", error);
    }
  };

  const handleClearCompleted = async () => {
    const completedItems = shoppingItems.filter(item => item.isCompleted);
    try {
      await Promise.all(completedItems.map(item => deleteItem(item.id)));
    } catch (error) {
      console.error("Error clearing completed items:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shopping List</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={handleClearCompleted}
            disabled={!shoppingItems.some(item => item.isCompleted)}
          >
            Clear completed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {shoppingItems.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-4">Your shopping list is empty</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {shoppingItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <Checkbox
                  checked={item.isCompleted}
                  onCheckedChange={(checked) => 
                    handleToggleCompleted(item.id, checked as boolean)
                  }
                />
                <span
                  className={`flex-1 ${
                    item.isCompleted
                      ? "text-slate-400 line-through"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {item.name}
                  {item.quantity && ` (${item.quantity})`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-red-500"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleAddItem} className="flex space-x-2">
          <Input
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add item..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
