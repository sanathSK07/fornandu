import { useAuth } from "@/contexts/AuthContext";
import { useGroceryItems, useShoppingList, useMealPlans } from "@/hooks/useFirestore";

export default function WelcomeCard() {
  const { user } = useAuth();
  const { data: groceryItems } = useGroceryItems();
  const { data: shoppingItems } = useShoppingList();
  const { data: mealPlans } = useMealPlans();

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  const expiringItems = groceryItems.filter(item => 
    item.expiryDate && new Date(item.expiryDate) <= threeDaysFromNow
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || "Chef";

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          {getGreeting()}, {displayName}!
        </h2>
        <p className="text-purple-100 mb-4">
          You have {groceryItems.length} items in your pantry and {expiringItems.length} items expiring soon.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <div className="text-sm text-purple-100">Items expiring soon</div>
            <div className="text-xl font-bold">{expiringItems.length}</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <div className="text-sm text-purple-100">Shopping list items</div>
            <div className="text-xl font-bold">{shoppingItems.length}</div>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <div className="text-sm text-purple-100">Planned meals</div>
            <div className="text-xl font-bold">{mealPlans.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
