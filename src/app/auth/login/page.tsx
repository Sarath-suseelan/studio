
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/30">
              M
            </div>
            <span className="font-headline font-black text-3xl tracking-tighter text-primary">MacroMentor</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Let's continue your health journey</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="alex@example.com" required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" required className="h-12 rounded-xl" />
            </div>
            <Button className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20" asChild>
              <Link href="/dashboard">Sign In</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="h-12 rounded-xl">Google</Button>
              <Button variant="outline" className="h-12 rounded-xl">Apple</Button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
