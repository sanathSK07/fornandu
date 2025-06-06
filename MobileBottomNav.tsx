import { Home, UtensilsCrossed, Calendar, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function MobileBottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/recipes", icon: UtensilsCrossed, label: "Recipes" },
    { path: "/meal-plan", icon: Calendar, label: "Plan" },
    { path: "/shopping", icon: ShoppingCart, label: "Shop" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 h-auto ${
                isActive ? "text-primary" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
