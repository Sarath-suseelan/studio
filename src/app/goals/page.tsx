'use client';

import { useState } from 'react';
import { useMeals } from '@/components/providers/meal-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Target, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_GOALS } from '@/lib/types';

export default function GoalsPage() {
  const { goals, updateGoals } = useMeals();
  const [tempGoals, setTempGoals] = useState(goals);
  const { toast } = useToast();

  const handleSave = () => {
    updateGoals(tempGoals);
    toast({
      title: "Goals Updated",
      description: "Your daily nutritional targets have been saved successfully.",
    });
  };

  const resetToDefault = () => {
    setTempGoals(DEFAULT_GOALS);
    toast({
      title: "Reset to Default",
      description: "Targets have been reset to general recommended values.",
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3 text-primary">
          <Target className="h-8 w-8 text-accent" />
          Nutritional Goals
        </h1>
        <p className="text-muted-foreground">Set your daily targets to track your progress effectively.</p>
      </header>

      <Card className="border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Daily Targets</CardTitle>
          <CardDescription>Adjust these based on your activity level and fitness goals.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Daily Calorie Goal (kcal)</Label>
              <Input
                id="calories"
                type="number"
                value={tempGoals.calories}
                onChange={(e) => setTempGoals({ ...tempGoals, calories: Number(e.target.value) })}
                className="text-lg h-11 border-primary/10"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="carbs" className="text-xs uppercase text-muted-foreground">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={tempGoals.carbohydrates}
                  onChange={(e) => setTempGoals({ ...tempGoals, carbohydrates: Number(e.target.value) })}
                  className="border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein" className="text-xs uppercase text-muted-foreground">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={tempGoals.protein}
                  onChange={(e) => setTempGoals({ ...tempGoals, protein: Number(e.target.value) })}
                  className="border-primary/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat" className="text-xs uppercase text-muted-foreground">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  value={tempGoals.fat}
                  onChange={(e) => setTempGoals({ ...tempGoals, fat: Number(e.target.value) })}
                  className="border-primary/10"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} className="flex-1 h-11 font-semibold rounded-xl">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={resetToDefault} className="h-11 font-semibold rounded-xl">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl text-sm text-accent-foreground">
        <h4 className="font-bold mb-2">Need help setting goals?</h4>
        <p>A common macro split for weight maintenance is 45-65% carbohydrates, 10-35% protein, and 20-35% fat. Consult with a nutritionist for personalized advice based on your specific health needs.</p>
      </div>
    </div>
  );
}
