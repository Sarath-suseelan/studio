
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/30">
              M
            </div>
            <span className="font-headline font-black text-3xl tracking-tighter text-primary">MacroMentor</span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold tracking-tight">Create your account</h2>
          <p className="text-sm text-muted-foreground">Start tracking your health with AI intelligence</p>
        </div>

        <Card className="border-none shadow-2xl">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Join thousands of users reaching their fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="Alex" required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Mentor" required className="h-12 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="alex@example.com" required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="h-12 rounded-xl" />
            </div>
            <Button className="w-full h-12 text-lg font-bold shadow-xl shadow-primary/20" asChild>
              <Link href="/dashboard">Create Account</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-xs text-center text-muted-foreground">
            By clicking continue, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
