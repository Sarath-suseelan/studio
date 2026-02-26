'use client';

import { useState } from 'react';
import { useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { firebaseConfig } from '@/firebase/config';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isConfigMissing = !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_API_KEY');

  const handleGoogleSignIn = async () => {
    if (!auth || isConfigMissing) return;
    
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      // Attempting to keep this as direct as possible to avoid popup blockers
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      let title = 'Authentication Error';
      let description = error.message;
      
      if (error.code === 'auth/popup-blocked') {
        title = 'Popup Blocked';
        description = 'Your browser blocked the sign-in window. Please click the button again and allow popups for this site.';
      } else if (error.code === 'auth/operation-not-allowed') {
        description = 'Google sign-in is not enabled in your Firebase project. Enable it in the Authentication > Sign-in method tab of the Firebase Console.';
      } else if (error.code === 'auth/invalid-api-key') {
        description = 'The Firebase API key is invalid. Please check your configuration in src/firebase/config.ts.';
      }

      toast({
        variant: 'destructive',
        title,
        description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || isConfigMissing) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <BrainCircuit className="h-7 w-7" />
            </div>
          </div>
          <CardTitle className="text-2xl font-headline font-bold">
            {isLogin ? 'Welcome back to MealIQ' : 'Create your account'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your credentials to access your meal data' 
              : 'Start tracking your nutrition intelligently today'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isConfigMissing && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Required</AlertTitle>
              <AlertDescription>
                Firebase is not configured. Go to the Firebase Console, get your Web App config, and update <code>src/firebase/config.ts</code>.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isConfigMissing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isConfigMissing}
              />
            </div>
            <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading || isConfigMissing}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full h-11 border-primary/20" 
            onClick={handleGoogleSignIn} 
            disabled={isLoading || isConfigMissing}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full text-xs" onClick={() => setIsLogin(!isLogin)} disabled={isConfigMissing}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
