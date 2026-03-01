
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-food');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            M
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">MacroMentor</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-headline font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                    Master Your Nutrition with <span className="text-primary">AI Intelligence</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    MacroMentor makes healthy eating effortless. Track your macros using just a photo, log meals manually, and reach your fitness goals faster.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="px-8" asChild>
                    <Link href="/auth/register">Get Started Free</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-8" asChild>
                    <Link href="/analyze">Try AI Analysis</Link>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> AI-Powered</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Personalized</div>
                  <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Secure</div>
                </div>
              </div>
              <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={heroImage?.imageUrl || 'https://picsum.photos/seed/macro1/1200/800'}
                  alt="Healthy Food"
                  fill
                  className="object-cover"
                  data-ai-hint="healthy food"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Everything You Need to Track Better</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've combined AI technology with a simple interface to help you stay on track without the headache.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 rounded-2xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Photo Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Just snap a photo of your meal. Our AI identifies food items and estimates macros instantly.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-2xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="rounded-full bg-secondary/10 p-3">
                  <Zap className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Instant Summaries</h3>
                <p className="text-center text-muted-foreground">
                  View your daily progress at a glance with beautiful, easy-to-read macro dashboards.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-2xl border bg-background p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Goal Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Set custom protein, carb, and fat targets based on your unique fitness journey.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-background">
        <p className="text-xs text-muted-foreground">© 2024 MacroMentor. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">Terms of Service</Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground" href="#">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
}
