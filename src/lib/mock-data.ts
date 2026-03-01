export interface MacroEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface UserGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MOCK_USER_GOALS: UserGoals = {
  calories: 2200,
  protein: 160,
  carbs: 220,
  fat: 70,
};

export const MOCK_DAILY_LOGS: MacroEntry[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 350,
    protein: 12,
    carbs: 60,
    fat: 8,
    timestamp: '2024-05-24T08:30:00.000Z',
    type: 'breakfast',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 450,
    protein: 45,
    carbs: 15,
    fat: 22,
    timestamp: '2024-05-24T12:45:00.000Z',
    type: 'lunch',
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    calories: 150,
    protein: 15,
    carbs: 10,
    fat: 5,
    timestamp: '2024-05-24T16:20:00.000Z',
    type: 'snack',
  }
];

export const FOOD_DATABASE = [
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice (100g)', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: 'Avocado (medium)', calories: 234, protein: 2.9, carbs: 12, fat: 21 },
  { name: 'Salmon Fillet (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Egg (large)', calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { name: 'Peanut Butter (1 tbsp)', calories: 94, protein: 4, carbs: 3, fat: 8 },
];
