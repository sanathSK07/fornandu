import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Clock } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
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
import { useMealPlans } from "@/hooks/useFirestore";

const mealTypes = ["breakfast", "lunch", "dinner", "snack"];

export default function MealPlan() {
  const { data: mealPlans, addItem, updateItem, deleteItem } = useMealPlans();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [newMeal, setNewMeal] = useState({
    customMealName: "",
    mealType: "dinner",
    notes: "",
  });

  // Get current week's start (Monday)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Group meals by date
  const mealsByDate = mealPlans.reduce((acc, meal) => {
    const dateKey = format(new Date(meal.plannedDate), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(meal);
    return acc;
  }, {} as Record<string, typeof mealPlans>);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeal.customMealName.trim()) return;

    try {
      const mealData = {
        ...newMeal,
        plannedDate: selectedDate,
      };

      if (editingMeal) {
        await updateItem(editingMeal.id, mealData);
      } else {
        await addItem(mealData);
      }

      setNewMeal({ customMealName: "", mealType: "dinner", notes: "" });
      setShowAddDialog(false);
      setEditingMeal(null);
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  const handleEditMeal = (meal: any) => {
    setEditingMeal(meal);
    setNewMeal({
      customMealName: meal.customMealName || "",
      mealType: meal.mealType || "dinner",
      notes: meal.notes || "",
    });
    setSelectedDate(new Date(meal.plannedDate));
    setShowAddDialog(true);
  };

  const handleDeleteMeal = async (mealId: string) => {
    try {
      await deleteItem(mealId);
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  const openAddDialog = (date: Date) => {
    setSelectedDate(date);
    setNewMeal({ customMealName: "", mealType: "dinner", notes: "" });
    setEditingMeal(null);
    setShowAddDialog(true);
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      lunch: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      dinner: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      snack: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[mealType as keyof typeof colors] || colors.dinner;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Meal Planner
          </h1>
          <p className="text-muted-foreground">
            Plan your meals for the week ahead
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
                <Button
                  onClick={() => openAddDialog(selectedDate)}
                  className="w-full mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Weekly View */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Week of {format(weekStart, 'MMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {weekDays.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayMeals = mealsByDate[dateKey] || [];
                    const isToday = isSameDay(day, new Date());
                    const isSelected = isSameDay(day, selectedDate);

                    return (
                      <div
                        key={dateKey}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : isToday
                            ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-sm">
                              {format(day, 'EEE')}
                            </h3>
                            <p className="text-lg font-bold">
                              {format(day, 'd')}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAddDialog(day)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {dayMeals.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              No meals planned
                            </p>
                          ) : (
                            dayMeals.map((meal) => (
                              <div
                                key={meal.id}
                                className="group relative bg-white dark:bg-slate-800 p-2 rounded border text-xs"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${getMealTypeColor(meal.mealType)}`}
                                  >
                                    {meal.mealType}
                                  </Badge>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                      onClick={() => handleEditMeal(meal)}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-500"
                                      onClick={() => handleDeleteMeal(meal.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="font-medium text-xs line-clamp-2">
                                  {meal.customMealName}
                                </p>
                                {meal.notes && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {meal.notes}
                                  </p>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <MobileBottomNav />

      {/* Add/Edit Meal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMeal ? "Edit Meal" : "Add Meal"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </DialogHeader>
          
          <form onSubmit={handleAddMeal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meal-name">Meal Name *</Label>
              <Input
                id="meal-name"
                value={newMeal.customMealName}
                onChange={(e) => setNewMeal({ ...newMeal, customMealName: e.target.value })}
                placeholder="e.g., Spaghetti Bolognese"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <Select
                value={newMeal.mealType}
                onValueChange={(value) => setNewMeal({ ...newMeal, mealType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mealTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-notes">Notes</Label>
              <Input
                id="meal-notes"
                value={newMeal.notes}
                onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingMeal ? "Update" : "Add"} Meal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
