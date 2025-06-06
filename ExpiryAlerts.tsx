import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Calendar } from "lucide-react";
import { useGroceryItems } from "@/hooks/useFirestore";

export default function ExpiryAlerts() {
  const { data: groceryItems = [] } = useGroceryItems();
  const [expiringItems, setExpiringItems] = useState<any[]>([]);

  useEffect(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const expiring = groceryItems.filter(item => {
      if (!item.expiryDate) return false;
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= threeDaysFromNow;
    });

    setExpiringItems(expiring);
  }, [groceryItems]);

  const getExpiryText = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    return `Expires in ${diffDays} days`;
  };

  const getExpiryVariant = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "destructive";
    if (diffDays <= 1) return "destructive";
    return "secondary";
  };

  if (expiringItems.length === 0) return null;

  return (
    <Alert className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-3">
          <div className="font-medium">Items expiring soon:</div>
          <div className="space-y-2">
            {expiringItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm">{item.name}</span>
                <Badge variant={getExpiryVariant(item.expiryDate)}>
                  <Clock className="h-3 w-3 mr-1" />
                  {getExpiryText(item.expiryDate)}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}