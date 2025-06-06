import { useState } from "react";
import { Plus, ShoppingCart, Search, Calendar } from "lucide-react";
import Header from "@/components/Header";
import MobileBottomNav from "@/components/MobileBottomNav";
import WelcomeCard from "@/components/WelcomeCard";
import QuickActionCard from "@/components/QuickActionCard";
import GroceryInventory from "@/components/GroceryInventory";
import RecipeSuggestions from "@/components/RecipeSuggestions";
import ShoppingList from "@/components/ShoppingList";
import MealPlanPreview from "@/components/MealPlanPreview";
import ExpiryAlerts from "@/components/ExpiryAlerts";
import { AddGroceryDialog } from "@/components/AddGroceryDialog";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [, setLocation] = useLocation();

  const quickActions = [
    {
      icon: Plus,
      title: "Add Grocery",
      description: "Track your ingredients",
      iconColor: "bg-secondary/10 text-secondary group-hover:bg-secondary/20",
      onClick: () => setShowAddDialog(true),
    },
    {
      icon: ShoppingCart,
      title: "Shopping List",
      description: "Plan your next trip",
      iconColor: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20",
      onClick: () => setLocation("/shopping"),
    },
    {
      icon: Search,
      title: "Find Recipes",
      description: "Cook with what you have",
      iconColor: "bg-red-500/10 text-red-500 group-hover:bg-red-500/20",
      onClick: () => setLocation("/recipes"),
    },
    {
      icon: Calendar,
      title: "Meal Plan",
      description: "Schedule your meals",
      iconColor: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20",
      onClick: () => setLocation("/meal-plan"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <WelcomeCard />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.title}
              icon={action.icon}
              title={action.title}
              description={action.description}
              iconColor={action.iconColor}
              onClick={action.onClick}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Grocery & Recipes */}
          <div className="lg:col-span-2 space-y-6">
            <GroceryInventory />
            <RecipeSuggestions />
          </div>

          {/* Right Column - Shopping & Meal Plan */}
          <div className="space-y-6">
            <ShoppingList />
            <MealPlanPreview />
            <ExpiryAlerts />
          </div>
        </div>
      </main>

      <MobileBottomNav />

      {/* Floating Action Button for Mobile */}
      <Button
        onClick={() => setShowAddDialog(true)}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-30"
        size="sm"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddGroceryDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}
