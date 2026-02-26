import { MealHistory } from '@/components/MealHistory';
import { History as HistoryIcon } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3 text-primary">
          <HistoryIcon className="h-8 w-8" />
          Meal History
        </h1>
        <p className="text-muted-foreground">Review everything you've tracked. Consistency is key to reaching your goals.</p>
      </header>

      <section>
        <MealHistory />
      </section>
    </div>
  );
}
