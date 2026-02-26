
'use client';

import { MacroSummary } from '@/components/MacroSummary';
import { MealInput } from '@/components/MealInput';
import { MealHistory } from '@/components/MealHistory';
import { useMeals } from '@/components/providers/meal-provider';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { ArrowRight, History as HistoryIcon, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user, loading: authLoading } = useUser();
  const { isLoading: mealsLoading } = useMeals();

  if (authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold font-headline text-primary tracking-tight">
            Track Your Nutrition <span className="text-accent">Intelligently</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MealIQ uses AI to analyze your meals from simple descriptions. 
            Sign in to start tracking your macronutrients and reach your fitness goals.
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl">
              <LogIn className="mr-2 h-5 w-5" />
              Get Started for Free
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          <FeatureCard 
            title="AI Analysis" 
            description="Just describe what you ate, and our AI handles the calorie and macro math." 
          />
          <FeatureCard 
            title="Goal Tracking" 
            description="Set daily targets and see your progress in real-time with beautiful charts." 
          />
          <FeatureCard 
            title="Secure History" 
            description="All your meals are saved securely to your account, accessible anywhere." 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">
              Good day, {user.displayName?.split(' ')[0] || 'seeker'}!
            </h1>
            <p className="text-muted-foreground">Here is how you are tracking today.</p>
          </div>
        </div>
        <MacroSummary />
      </section>

      <div className="grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3 space-y-6">
          <MealInput />
        </section>

        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-headline font-semibold flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-primary" />
              Recent Meals
            </h2>
            <Link href="/history" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {mealsLoading ? (
             <div className="flex justify-center p-8">
               <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
             </div>
          ) : (
            <MealHistory limit={3} />
          )}
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white/50 border border-primary/10 text-left shadow-sm">
      <h3 className="text-lg font-bold text-primary mb-2 font-headline">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
