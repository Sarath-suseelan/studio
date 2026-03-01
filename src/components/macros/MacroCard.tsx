
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MacroCardProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  colorClass: string;
}

export function MacroCard({ label, current, goal, unit, colorClass }: MacroCardProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className="text-lg font-bold">
            {current} <span className="text-xs font-normal text-muted-foreground">/ {goal}{unit}</span>
          </span>
        </div>
        <Progress value={percentage} className={cn("h-2", colorClass)} />
      </CardContent>
    </Card>
  );
}
