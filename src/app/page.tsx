import { MacroSummary } from '@/components/MacroSummary';
import { MealInput } from '@/components/MealInput';
import { MealHistory } from '@/components/MealHistory';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, History as HistoryIcon } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Good day, Health seeker!</h1>
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
          <MealHistory limit={3} />
        </section>
      </div>
    </div>
  );
}
