import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  iconColor: string;
}

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  iconColor
}: QuickActionCardProps) {
  return (
    <Button
      variant="outline"
      className="h-auto p-6 flex flex-col items-start text-left group hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${iconColor}`}>
        <Icon className="text-xl" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </Button>
  );
}
