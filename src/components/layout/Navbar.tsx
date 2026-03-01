
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, BookOpen, User, PieChart, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: PieChart },
  { name: 'Analyze', href: '/analyze', icon: Camera },
  { name: 'Log Meal', href: '/log', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
            M
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">MacroMentor</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">Logout</Link>
          </Button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-10">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-lg font-medium p-3 rounded-lg transition-colors",
                      pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.name}
                  </Link>
                ))}
                <Button className="mt-4" asChild>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>Logout</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
