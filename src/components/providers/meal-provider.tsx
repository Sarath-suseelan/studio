'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MealEntry, UserGoals, DEFAULT_GOALS } from '@/lib/types';

interface MealContextType {
  meals: MealEntry[];
  goals: UserGoals;
  addMeal: (meal: Omit<MealEntry, 'id' | 'date'>) => void;
  removeMeal: (id: string) => void;
  updateGoals: (goals: UserGoals) => void;
  dailyTotals: { calories: number; carbohydrates: number; protein: number; fat: number };
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedMeals = localStorage.getItem('mealiq_meals');
    const savedGoals = localStorage.getItem('mealiq_goals');
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('mealiq_meals', JSON.stringify(meals));
    }
  }, [meals, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('mealiq_goals', JSON.stringify(goals));
    }
  }, [goals, isInitialized]);

  const addMeal = (meal: Omit<MealEntry, 'id' | 'date'>) => {
    const newEntry: MealEntry = {
      ...meal,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setMeals((prev) => [newEntry, ...prev]);
  };

  const removeMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const updateGoals = (newGoals: UserGoals) => {
    setGoals(newGoals);
  };

  const today = new Date().toDateString();
  const dailyTotals = meals
    .filter((m) => new Date(m.date).toDateString() === today)
    .reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        carbohydrates: acc.carbohydrates + m.macros.carbohydrates,
        protein: acc.protein + m.macros.protein,
        fat: acc.fat + m.macros.fat,
      }),
      { calories: 0, carbohydrates: 0, protein: 0, fat: 0 }
    );

  return (
    <MealContext.Provider value={{ meals, goals, addMeal, removeMeal, updateGoals, dailyTotals }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeals() {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
}
