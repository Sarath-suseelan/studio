
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FOOD_DATABASE } from '@/lib/mock-data';
import { Search, Plus, Utensils, History, Info, Loader2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, query } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function LogPage() {
  const [search, setSearch] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [isLogging, setIsLogging] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();
  const { firestore } = useFirestore();
  const { toast } = useToast();

  // Custom Food Form State
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Fetch user's custom food items
  const customFoodsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'custom_food_items'));
  }, [firestore, user]);

  const { data: customFoods } = useCollection(customFoodsQuery);

  // Combine system foods with user's custom foods
  const allFoods = [
    ...FOOD_DATABASE,
    ...(customFoods?.map(cf => ({
      name: cf.name,
      calories: Number(cf.caloriesPerServing || cf.calories),
      protein: Number(cf.proteinPerServingGrams || cf.protein),
      carbs: Number(cf.carbsPerServingGrams || cf.carbs),
      fat: Number(cf.fatPerServingGrams || cf.fat),
      isCustom: true
    })) || [])
  ];

  const filteredFoods = allFoods.filter(food => 
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLog = async (food: any) => {
    if (!user || !firestore) return;

    const logId = doc(collection(firestore, 'placeholder')).id;
    setIsLogging(food.name);

    const mealLogRef = doc(firestore, 'users', user.uid, 'meal_logs', logId);
    
    setDocumentNonBlocking(mealLogRef, {
      id: logId,
      userId: user.uid,
      logDateTime: new Date().toISOString(),
      mealType: mealType,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      createdAt: serverTimestamp(),
    }, { merge: true });

    toast({
      title: "Success",
      description: `${food.name} has been added to your log.`,
    });
    
    setIsLogging(null);
  };

  const handleCreateCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) return;

    const foodId = doc(collection(firestore, 'placeholder')).id;
    const foodRef = doc(firestore, 'users', user.uid, 'custom_food_items', foodId);

    setDocumentNonBlocking(foodRef, {
      id: foodId,
      name: customFood.name,
      caloriesPerServing: Number(customFood.calories),
      proteinPerServingGrams: Number(customFood.protein),
      carbsPerServingGrams: Number(customFood.carbs),
      fatPerServingGrams: Number(customFood.fat),
      servingSizeUnit: 'serving',
      servingSizeValue: 1,
      isSystemFood: false,
      createdByUserId: user.uid,
      createdAt: serverTimestamp(),
    }, { merge: true });

    toast({
      title: "Food Created",
      description: `${customFood.name} has been added to your custom library.`,
    });

    setIsDialogOpen(false);
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold">Log Your Meal</h1>
            <p className="text-muted-foreground">Search our database or add a custom entry.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search food database..." 
                className="pl-10 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-dashed">
                  <PlusCircle className="w-6 h-6 text-primary" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateCustomFood}>
                  <DialogHeader>
                    <DialogTitle>Create Custom Food</DialogTitle>
                    <DialogDescription>
                      Add a food item that isn't in our database yet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Food Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g. My Special Protein Shake"
                        value={customFood.name}
                        onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="calories">Calories (kcal)</Label>
                        <Input
                          id="calories"
                          type="number"
                          placeholder="0"
                          value={customFood.calories}
                          onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input
                          id="protein"
                          type="number"
                          placeholder="0"
                          value={customFood.protein}
                          onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input
                          id="carbs"
                          type="number"
                          placeholder="0"
                          value={customFood.carbs}
                          onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input
                          id="fat"
                          type="number"
                          placeholder="0"
                          value={customFood.fat}
                          onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">Save Food Item</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {mealTypes.map((type) => (
              <Badge 
                key={type}
                variant={mealType === type ? "secondary" : "outline"} 
                className="px-4 py-1.5 cursor-pointer whitespace-nowrap"
                onClick={() => setMealType(type)}
              >
                {type}
              </Badge>
            ))}
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> 
                {search ? 'Search Results' : 'Recent & System Foods'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{food.name}</p>
                            {'isCustom' in food && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-primary/30 text-primary">Custom</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="rounded-full hover:bg-primary hover:text-white" 
                        onClick={() => handleLog(food)}
                        disabled={!!isLogging}
                      >
                        {isLogging === food.name ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3 px-4">
                    <Info className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground">No foods found. Try a different search or create one.</p>
                    <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Create Custom Food
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
