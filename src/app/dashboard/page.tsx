'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MacroCard } from '@/components/macros/MacroCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, Utensils, Zap, Flame, Trophy, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, orderBy, limit } from 'firebase/firestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirestore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile } = useDoc(userProfileRef);

  const mealLogsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'meal_logs'),
      orderBy('logDateTime', 'desc'),
      limit(10)
    );
  }, [firestore, user]);

  const { data: mealLogs, isLoading: isLogsLoading } = useCollection(mealLogsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate totals from real logs
  const totals = mealLogs?.reduce(
    (acc, curr) => ({
      calories: acc.calories + (Number(curr.calories) || 0),
      protein: acc.protein + (Number(curr.protein) || 0),
      carbs: acc.carbs + (Number(curr.carbs) || 0),
      fat: acc.fat + (Number(curr.fat) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const goals = {
    calories: profile?.dailyCalorieGoal || 2000,
    protein: profile?.dailyProteinGoalGrams || 150,
    carbs: profile?.dailyCarbGoalGrams || 200,
    fat: profile?.dailyFatGoalGrams || 65,
  };

  const chartData = [
    { name: 'Protein', value: totals.protein, goal: goals.protein, fill: 'hsl(var(--primary))' },
    { name: 'Carbs', value: totals.carbs, goal: goals.carbs, fill: 'hsl(var(--secondary))' },
    { name: 'Fat', value: totals.fat, goal: goals.fat, fill: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold">Good morning, {user.displayName?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-muted-foreground">Here's your nutritional summary for today.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="rounded-full shadow-lg shadow-primary/20" asChild>
              <Link href="/log"><Plus className="w-4 h-4 mr-2" /> Log Meal</Link>
            </Button>
          </div>
        </div>

        <Card className="mb-8 border-none shadow-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground overflow-hidden">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-secondary-foreground" />
                  <span className="text-lg font-medium opacity-90">Calories for today</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-headline font-black tracking-tighter">
                    {totals.calories}
                  </span>
                  <span className="text-xl opacity-75">/ {goals.calories} kcal</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4" /> {Math.max(0, goals.calories - totals.calories)} left
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4" /> {goals.calories > 0 ? Math.round((totals.calories / goals.calories) * 100) : 0}% reach
                  </div>
                </div>
              </div>
              <div className="h-[180px] w-full bg-white/10 rounded-2xl p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="white" tick={{fontSize: 12}} width={70} />
                    <Tooltip 
                      cursor={{fill: 'rgba(255,255,255,0.1)'}} 
                      contentStyle={{borderRadius: '8px', border: 'none', color: 'black'}}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MacroCard 
            label="Protein" 
            current={totals.protein} 
            goal={goals.protein} 
            unit="g" 
            colorClass="bg-primary"
          />
          <MacroCard 
            label="Carbohydrates" 
            current={totals.carbs} 
            goal={goals.carbs} 
            unit="g" 
            colorClass="bg-secondary"
          />
          <MacroCard 
            label="Fats" 
            current={totals.fat} 
            goal={goals.fat} 
            unit="g" 
            colorClass="bg-chart-3"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-headline flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" /> Today's Meals
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/log" className="text-primary">Log More <ChevronRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLogsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                  </div>
                ) : mealLogs && mealLogs.length > 0 ? (
                  mealLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary">
                          <Utensils className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{log.name || 'Logged Meal'}</h4>
                          <p className="text-xs text-muted-foreground capitalize">
                            {log.mealType} • {new Date(log.logDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{log.calories} kcal</div>
                        <div className="text-xs text-muted-foreground">
                          P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <Utensils className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground">No meals logged for today.</p>
                    <Button variant="outline" asChild>
                      <Link href="/log">Start Logging</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-4xl font-black text-primary mb-2">1 Day</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Active Streak</div>
                  <div className="flex gap-1 mt-4 justify-center">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <div 
                        key={d} 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          d === 1 ? "bg-primary text-white scale-110 shadow-md shadow-primary/30" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][d-1]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal Success</span>
                  <span className="font-bold text-primary">
                    {goals.calories > 0 ? Math.round((totals.calories / goals.calories) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
