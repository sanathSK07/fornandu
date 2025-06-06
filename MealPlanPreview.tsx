import { useState } from "react";
import { Calendar, Clock, Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMealPlans } from "@/hooks/useFirestore";
import { format, addDays, startOfWeek } from "date-fns";

export default function MealPlanPreview() {
  const { data: mealPlans, addItem } = useMealPlans();
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  
  // Get this week's meals
  const thisWeekMeals = mealPlans.filter(meal => {
    const mealDate = new Date(meal.plannedDate);
    const endOfWeek = addDays(startOfCurrentWeek, 6);
    return mealDate >= startOfCurrentWeek && mealDate <= endOfWeek;
  });

  // Group meals by day
  const mealsByDay = thisWeekMeals.reduce((acc, meal) => {
    const dayKey = format(new Date(meal.plannedDate), 'yyyy-MM-dd');
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(meal);
    return acc;
  }, {} as Record<string, typeof mealPlans>);

  const getNextThreeDays = () => {
    return [0, 1, 2].map(offset => {
      const date = addDays(today, offset);
      const dayKey = format(date, 'yyyy-MM-dd');
      const dayName = offset === 0 ? 'Today' : 
                     offset === 1 ? 'Tomorrow' : 
                     format(date, 'EEE');
      const fullDayName = offset === 0 ? `Today (${format(date, 'EEE')})` : 
                         offset === 1 ? `Tomorrow (${format(date, 'EEE')})` : 
                         format(date, 'EEE');
      
      return {
        date,
        dayKey,
        dayName,
        fullDayName,
        meals: mealsByDay[dayKey] || []
      };
    });
  };

  const handleAddMeal = async (date: Date) => {
    // For now, add a placeholder meal
    try {
      await addItem({
        customMealName: "New Meal",
        plannedDate: date,
        mealType: "dinner",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding meal:", error);
    }
  };

  const handleAutoPlan = async () => {
    setLoading(true);
    // This would typically use AI or algorithm to suggest meals
    // For now, we'll add some sample meals
    try {
      const sampleMeals = [
        { name: "Pasta with Marinara", type: "dinner", offset: 0 },
        { name: "Chicken Salad", type: "lunch", offset: 1 },
        { name: "Vegetable Stir Fry", type: "dinner", offset: 2 },
      ];

      for (const meal of sampleMeals) {
        const plannedDate = addDays(today, meal.offset);
        await addItem({
          customMealName: meal.name,
          plannedDate,
          mealType: meal.type,
          notes: "Auto-planned meal",
        });
      }
    } catch (error) {
      console.error("Error auto-planning meals:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>This Week's Meals</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            <Calendar className="h-4 w-4 mr-1" />
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {getNextThreeDays().map((day) => (
            <div key={day.dayKey}>
              {day.meals.length > 0 ? (
                day.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        {day.fullDayName}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {meal.customMealName || `Recipe: ${meal.recipeId}`}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="capitalize">{meal.mealType}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between p-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                  <div className="text-slate-600 dark:text-slate-400">
                    <div className="font-medium">{day.fullDayName}</div>
                    <div className="text-sm">No meal planned</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddMeal(day.date)}
                    className="text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button
          onClick={handleAutoPlan}
          disabled={loading}
          className="w-full mt-4"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {loading ? "Planning..." : "Auto-plan week"}
        </Button>
      </CardContent>
    </Card>
  );
}
