'use client';

import { useState, useEffect } from 'react';
import { useMeals } from '@/components/providers/meal-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const chartConfig = {
  carbohydrates: {
    label: "Carbohydrates",
    color: "hsl(var(--chart-1))",
  },
  protein: {
    label: "Protein",
    color: "hsl(var(--chart-2))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function MacroSummary() {
  const { dailyTotals, goals } = useMeals();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { name: 'carbohydrates', value: dailyTotals.carbohydrates || 1, fill: 'var(--color-carbohydrates)' },
    { name: 'protein', value: dailyTotals.protein || 1, fill: 'var(--color-protein)' },
    { name: 'fat', value: dailyTotals.fat || 1, fill: 'var(--color-fat)' },
  ];

  const calPercentage = Math.min((dailyTotals.calories / (goals.calories || 1)) * 100, 100);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-full md:col-span-1 lg:col-span-2 overflow-hidden bg-white/50 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-headline">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="h-40 w-40 shrink-0 mx-auto relative">
              {mounted ? (
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        isAnimationActive={true}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="h-full w-full rounded-full border-8 border-secondary flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Loading...</span>
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-2xl font-bold font-headline">{dailyTotals.calories}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">kcal</div>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 pt-8 md:pt-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Calories</span>
                  <span className="text-muted-foreground">{dailyTotals.calories} / {goals.calories} kcal</span>
                </div>
                <Progress value={calPercentage} className="h-2 bg-secondary" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <StatBox label="Carbs" value={dailyTotals.carbohydrates} goal={goals.carbohydrates} unit="g" color="var(--color-carbohydrates)" />
                <StatBox label="Protein" value={dailyTotals.protein} goal={goals.protein} unit="g" color="var(--color-protein)" />
                <StatBox label="Fat" value={dailyTotals.fat} goal={goals.fat} unit="g" color="var(--color-fat)" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-1 border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline text-primary">
            {Math.max(0, goals.calories - dailyTotals.calories)} <span className="text-sm font-normal">kcal</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">To reach your daily target</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-1 lg:col-span-1 border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Macronutrient Ratio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-dashed">
            <span>Carbohydrates</span>
            <span className="font-semibold">{Math.round((dailyTotals.carbohydrates * 4 / Math.max(1, dailyTotals.calories)) * 100) || 0}%</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-dashed">
            <span>Protein</span>
            <span className="font-semibold">{Math.round((dailyTotals.protein * 4 / Math.max(1, dailyTotals.calories)) * 100) || 0}%</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span>Fat</span>
            <span className="font-semibold">{Math.round((dailyTotals.fat * 9 / Math.max(1, dailyTotals.calories)) * 100) || 0}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatBox({ label, value, goal, unit, color }: { label: string; value: number; goal: number; unit: string; color: string }) {
  const percentage = Math.min((value / (goal || 1)) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className="text-sm font-bold">{value}{unit}</div>
      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
        <div className="h-full" style={{ width: `${percentage}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
