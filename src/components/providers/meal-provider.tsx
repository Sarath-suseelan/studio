
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { MealEntry, UserGoals, DEFAULT_GOALS } from '@/lib/types';
import { useUser, useFirestore, useCollection, useDoc } from '@/firebase';
import { collection, doc, setDoc, addDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/firestore/use-collection';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface MealContextType {
  meals: MealEntry[];
  goals: UserGoals;
  isLoading: boolean;
  addMeal: (meal: Omit<MealEntry, 'id' | 'date'>) => void;
  removeMeal: (id: string) => void;
  updateGoals: (goals: UserGoals) => void;
  dailyTotals: { calories: number; carbohydrates: number; protein: number; fat: number };
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();

  const mealsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'meals'), orderBy('date', 'desc'));
  }, [db, user]);

  const goalsDoc = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid, 'settings', 'goals');
  }, [db, user]);

  const { data: mealsData, loading: mealsLoading } = useCollection<MealEntry>(mealsQuery);
  const { data: goalsData, loading: goalsLoading } = useDoc<UserGoals>(goalsDoc);

  const meals = mealsData || [];
  const goals = goalsData || DEFAULT_GOALS;
  const isLoading = authLoading || mealsLoading || goalsLoading;

  const addMeal = (meal: Omit<MealEntry, 'id' | 'date'>) => {
    if (!db || !user) return;
    const mealRef = collection(db, 'users', user.uid, 'meals');
    const newMeal = {
      ...meal,
      date: new Date().toISOString(),
    };
    
    addDoc(mealRef, newMeal).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: mealRef.path,
        operation: 'create',
        requestResourceData: newMeal,
      }));
    });
  };

  const removeMeal = (id: string) => {
    if (!db || !user) return;
    const mealDoc = doc(db, 'users', user.uid, 'meals', id);
    deleteDoc(mealDoc).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: mealDoc.path,
        operation: 'delete',
      }));
    });
  };

  const updateGoals = (newGoals: UserGoals) => {
    if (!db || !user) return;
    const goalsRef = doc(db, 'users', user.uid, 'settings', 'goals');
    setDoc(goalsRef, newGoals, { merge: true }).catch(async (e) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: goalsRef.path,
        operation: 'update',
        requestResourceData: newGoals,
      }));
    });
  };

  const dailyTotals = useMemo(() => {
    const today = new Date().toDateString();
    return meals
      .filter((m) => {
        try {
          return new Date(m.date).toDateString() === today;
        } catch (e) {
          return false;
        }
      })
      .reduce(
        (acc, m) => ({
          calories: acc.calories + m.calories,
          carbohydrates: acc.carbohydrates + m.macros.carbohydrates,
          protein: acc.protein + m.macros.protein,
          fat: acc.fat + m.macros.fat,
        }),
        { calories: 0, carbohydrates: 0, protein: 0, fat: 0 }
      );
  }, [meals]);

  return (
    <MealContext.Provider value={{ meals, goals, isLoading, addMeal, removeMeal, updateGoals, dailyTotals }}>
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
