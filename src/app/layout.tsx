import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MealProvider } from '@/components/providers/meal-provider';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'MealIQ - Intelligent Macronutrient Tracking',
  description: 'AI-powered meal logging and nutrition tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <MealProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </MealProvider>
      </body>
    </html>
  );
}
