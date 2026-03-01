'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MacroCard } from '@/components/macros/MacroCard';
import { MOCK_USER_GOALS, MOCK_DAILY_LOGS } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight, Utensils, Zap, Flame, Trophy } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const totals = MOCK_DAILY_LOGS.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      carbs: acc.carbs + curr.carbs,
      fat: acc.fat + curr.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const chartData = [
    { name: 'Protein', value: totals.protein, goal: MOCK_USER_GOALS.protein, fill: 'hsl(var(--primary))' },
    { name: 'Carbs', value: totals.carbs, goal: MOCK_USER_GOALS.carbs, fill: 'hsl(var(--secondary))' },
    { name: 'Fat', value: totals.fat, goal: MOCK_USER_GOALS.fat, fill: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold">Good morning, Alex! 👋</h1>
            <p className="text-muted-foreground">Here's your nutritional summary for today.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="rounded-full shadow-lg shadow-primary/20" asChild>
              <Link href="/analyze"><Plus className="w-4 h-4 mr-2" /> AI Analyze</Link>
            </Button>
            <Button size="sm" variant="outline" className="rounded-full" asChild>
              <Link href="/log">Manual Log</Link>
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
                  <span className="text-xl opacity-75">/ {MOCK_USER_GOALS.calories} kcal</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Zap className="w-4 h-4" /> {Math.max(0, MOCK_USER_GOALS.calories - totals.calories)} left
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <Trophy className="w-4 h-4" /> {Math.round((totals.calories / MOCK_USER_GOALS.calories) * 100)}% reach
                  </div>
                </div>
              </div>
              <div className="h-[180px] w-full bg-white/10 rounded-2xl p-4">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: -20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" stroke="white" tick={{fontSize: 12}} width={70} />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.1)'}} 
                        contentStyle={{borderRadius: '8px', border: 'none'}}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MacroCard 
            label="Protein" 
            current={totals.protein} 
            goal={MOCK_USER_GOALS.protein} 
            unit="g" 
            colorClass="bg-primary"
          />
          <MacroCard 
            label="Carbohydrates" 
            current={totals.carbs} 
            goal={MOCK_USER_GOALS.carbs} 
            unit="g" 
            colorClass="bg-secondary"
          />
          <MacroCard 
            label="Fats" 
            current={totals.fat} 
            goal={MOCK_USER_GOALS.fat} 
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
                <Link href="/log" className="text-primary">View All <ChevronRight className="ml-1 w-4 h-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_DAILY_LOGS.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary">
                        <Utensils className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{log.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {log.type} • {mounted ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
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
                ))}
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
                  <div className="text-4xl font-black text-primary mb-2">3 Day</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Streak</div>
                  <div className="flex gap-1 mt-4 justify-center">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <div 
                        key={d} 
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                          d <= 3 ? "bg-primary text-white scale-110 shadow-md shadow-primary/30" : "bg-muted text-muted-foreground"
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
                  <span className="text-muted-foreground">Avg. Calories</span>
                  <span className="font-bold">2,105 kcal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal Success</span>
                  <span className="font-bold text-primary">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
