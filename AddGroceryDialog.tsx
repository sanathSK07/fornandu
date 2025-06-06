import { useState, useEffect } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useGroceryItems } from "@/hooks/useFirestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddGroceryDialogProps {
  open: boolean;
  onClose: () => void;
  editingItem?: any;
}

const categories = [
  "Fruits",
  "Vegetables", 
  "Dairy",
  "Meat",
  "Grains",
  "Pantry",
  "Frozen",
  "Beverages",
  "Snacks",
  "Other"
];

const units = [
  "pieces",
  "kg",
  "g",
  "lbs",
  "oz",
  "liters",
  "ml",
  "cups",
  "tbsp",
  "tsp",
  "packages",
  "cans",
  "bottles"
];

export function AddGroceryDialog({ open, onClose, editingItem }: AddGroceryDialogProps) {
  const { addItem, updateItem } = useGroceryItems();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
    expiryDate: null as Date | null,
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        quantity: editingItem.quantity || "",
        unit: editingItem.unit || "",
        category: editingItem.category || "",
        expiryDate: editingItem.expiryDate ? new Date(editingItem.expiryDate) : null,
        notes: editingItem.notes || ""
      });
    } else {
      setFormData({
        name: "",
        quantity: "",
        unit: "",
        category: "",
        expiryDate: null,
        notes: ""
      });
    }
  }, [editingItem, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) return;

    setLoading(true);
    try {
      const itemData = {
        name: formData.name.trim(),
        quantity: formData.quantity.trim(),
        unit: formData.unit.trim(),
        category: formData.category.trim(),
        expiryDate: formData.expiryDate,
        notes: formData.notes?.trim() || "",
      };

      if (editingItem) {
        await updateItem(editingItem.id, itemData);
        toast({
          title: "Item updated",
          description: `${itemData.name} has been updated successfully.`,
        });
      } else {
        await addItem(itemData);
        toast({
          title: "Item added",
          description: `${itemData.name} has been added to your inventory.`,
        });
      }
      
      onClose();
    } catch (error: any) {
      console.error("Error saving item:", error);
      toast({
        title: "Error saving item",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Grocery Item" : "Add Grocery Item"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Apples, Milk, Bread"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g., 6, 2.5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, expiryDate: date || null })}
                  initialFocus
                />
                {formData.expiryDate && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setFormData({ ...formData, expiryDate: null })}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editingItem ? "Update" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
