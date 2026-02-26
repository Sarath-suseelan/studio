import { MealInput } from '@/components/MealInput';
import { PlusCircle } from 'lucide-react';

export default function LogPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold font-headline flex items-center justify-center gap-3 text-primary">
          <PlusCircle className="h-8 w-8 text-accent" />
          Log a New Meal
        </h1>
        <p className="text-muted-foreground">Use natural language to tell us what you ate. We'll handle the math.</p>
      </header>

      <section>
        <MealInput />
      </section>

      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
        <h3 className="font-bold mb-4 text-primary">Pro Tips for Best AI Accuracy:</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">1</span>
            Specify quantities like "2 cups", "1 large", or "100g" whenever possible.
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">2</span>
            Mention cooking methods like "grilled", "fried", or "steamed".
          </li>
          <li className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">3</span>
            Don't forget extras like oils, sauces, or dressings.
          </li>
        </ul>
      </div>
    </div>
  );
}
