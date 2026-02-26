'use client';

import React, { useState } from 'react';
import { useMeals } from '@/components/providers/meal-provider';
import { logMealWithAI } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Apple, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MealInput() {
  const [description, setDescription] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const { addMeal } = useMeals();
  const { toast } = useToast();

  const handleLogMeal = async () => {
    if (!description.trim()) return;

    setIsEstimating(true);
    try {
      const result = await logMealWithAI(description);
      addMeal({
        name: result.mealName,
        description: description,
        calories: result.totalCalories,
        macros: {
          carbohydrates: result.macronutrients.carbohydrates,
          protein: result.macronutrients.protein,
          fat: result.macronutrients.fat,
        },
        ingredients: result.ingredients.map(i => ({ name: i.name, quantity: i.quantity })),
      });
      setDescription('');
      toast({
        title: "Meal Logged!",
        description: `Successfully analyzed and saved: ${result.mealName}`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to analyze meal.",
      });
    } finally {
      setIsEstimating(false);
    }
  };

  const suggestions = [
    "A bowl of oatmeal with a banana and two spoons of peanut butter",
    "Grilled salmon with roasted asparagus and a cup of quinoa",
    "Double cheeseburger with a large fries and a soda",
    "Chicken caesar salad with extra parmesan cheese",
  ];

  return (
    <Card className="w-full border-primary/20 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-5 w-5 text-accent" />
          Intelligent Meal Logging
        </CardTitle>
        <CardDescription>
          Describe your meal in plain English. Our AI will estimate the macros for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="What are you eating? (e.g., '3 scrambled eggs with a slice of sourdough toast')"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] text-base resize-none border-primary/10 focus-visible:ring-primary/30"
          disabled={isEstimating}
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 font-semibold h-12 rounded-xl text-lg shadow-md shadow-primary/20"
            onClick={handleLogMeal}
            disabled={isEstimating || !description.trim()}
          >
            {isEstimating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Meal...
              </>
            ) : (
              <>
                <Apple className="mr-2 h-5 w-5" />
                Analyze & Log
              </>
            )}
          </Button>
        </div>
        
        <div className="pt-4">
          <p className="text-xs text-muted-foreground mb-2">Try suggesting:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setDescription(suggestion)}
                className="text-xs bg-secondary hover:bg-secondary/70 text-secondary-foreground px-3 py-1.5 rounded-full transition-colors border border-transparent hover:border-primary/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
