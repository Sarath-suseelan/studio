'use client';

import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-6 text-center text-xs text-muted-foreground border-t">
      &copy; {year || '...'} MealIQ. Refreshing health management.
    </footer>
  );
}
