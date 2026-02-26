export type Macronutrients = {
  carbohydrates: number;
  protein: number;
  fat: number;
};

export type Ingredient = {
  name: string;
  quantity: string;
};

export type MealEntry = {
  id: string;
  date: string;
  name: string;
  description: string;
  calories: number;
  macros: Macronutrients;
  ingredients: Ingredient[];
};

export type UserGoals = Macronutrients & {
  calories: number;
};

export const DEFAULT_GOALS: UserGoals = {
  calories: 2000,
  carbohydrates: 250,
  protein: 150,
  fat: 70,
};
