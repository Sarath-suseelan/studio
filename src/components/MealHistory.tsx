'use client';

import { useMeals } from '@/components/providers/meal-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Utensils, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function MealHistory({ limit }: { limit?: number }) {
  const { meals, removeMeal } = useMeals();
  
  const displayMeals = limit ? meals.slice(0, limit) : meals;

  if (meals.length === 0) {
    return (
      <div className="text-center py-12 bg-white/30 rounded-2xl border-2 border-dashed border-primary/20">
        <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No meals logged yet. Start by logging your first meal!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayMeals.map((meal) => (
        <Card key={meal.id} className="group overflow-hidden border-primary/5 hover:border-primary/20 transition-all hover:shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <div className="p-4 sm:p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-primary">{meal.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {format(new Date(meal.date), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeMeal(meal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 italic">
                  "{meal.description}"
                </p>

                <div className="grid grid-cols-4 gap-2 border-t pt-4 border-dashed">
                  <MacroItem label="Cals" value={meal.calories} unit="" />
                  <MacroItem label="Carbs" value={meal.macros.carbohydrates} unit="g" />
                  <MacroItem label="Protein" value={meal.macros.protein} unit="g" />
                  <MacroItem label="Fat" value={meal.macros.fat} unit="g" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MacroItem({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="text-center">
      <div className="text-[10px] text-muted-foreground uppercase font-bold">{label}</div>
      <div className="text-sm font-semibold">{value}{unit}</div>
    </div>
  );
}
