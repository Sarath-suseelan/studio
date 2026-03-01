
'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FOOD_DATABASE } from '@/lib/mock-data';
import { Search, Plus, Utensils, History, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function LogPage() {
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const filteredFoods = FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLog = (foodName: string) => {
    toast({
      title: "Success",
      description: `${foodName} has been added to your log.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-headline font-bold">Log Your Meal</h1>
            <p className="text-muted-foreground">Search our database or add a custom entry.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search food database..." 
              className="pl-10 h-12 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge variant="secondary" className="px-4 py-1.5 cursor-pointer">Breakfast</Badge>
            <Badge variant="outline" className="px-4 py-1.5 cursor-pointer">Lunch</Badge>
            <Badge variant="outline" className="px-4 py-1.5 cursor-pointer">Dinner</Badge>
            <Badge variant="outline" className="px-4 py-1.5 cursor-pointer">Snack</Badge>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Suggestions
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
                          <p className="font-semibold">{food.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {food.calories} kcal • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                          </p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary hover:text-white" onClick={() => handleLog(food.name)}>
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <Info className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground">No foods found. Try a different search.</p>
                    <Button variant="outline">Create Custom Food</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-primary">Can't find it?</h3>
                <p className="text-sm text-muted-foreground">Snap a photo and let our AI analyze it for you.</p>
              </div>
              <Button asChild className="shadow-lg shadow-primary/20">
                <a href="/analyze">Try AI Analysis</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
