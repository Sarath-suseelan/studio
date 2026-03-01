'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { Settings, User, Bell, Shield, Heart, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirestore ? { firestore: useFirestore() } : { firestore: null };
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    dailyCalorieGoal: 2000,
    dailyProteinGoalGrams: 150,
    dailyCarbGoalGrams: 200,
    dailyFatGoalGrams: 65,
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        email: profile.email || '',
        dailyCalorieGoal: profile.dailyCalorieGoal || 2000,
        dailyProteinGoalGrams: profile.dailyProteinGoalGrams || 150,
        dailyCarbGoalGrams: profile.dailyCarbGoalGrams || 200,
        dailyFatGoalGrams: profile.dailyFatGoalGrams || 65,
      });
    }
  }, [profile]);

  const handleSaveAccount = () => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
      displayName: formData.displayName,
      email: formData.email,
      updatedAt: serverTimestamp(),
    });
    toast({
      title: "Account Updated",
      description: "Your personal details have been saved successfully.",
    });
  };

  const handleUpdateGoals = () => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
      dailyCalorieGoal: Number(formData.dailyCalorieGoal),
      dailyProteinGoalGrams: Number(formData.dailyProteinGoalGrams),
      dailyCarbGoalGrams: Number(formData.dailyCarbGoalGrams),
      dailyFatGoalGrams: Number(formData.dailyFatGoalGrams),
      updatedAt: serverTimestamp(),
    });
    toast({
      title: "Goals Updated",
      description: "Your daily nutritional targets have been adjusted.",
    });
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const initials = formData.displayName
    ? formData.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : '??';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card className="text-center overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary to-secondary" />
              <CardContent className="pt-0 relative">
                <div className="flex justify-center -mt-12 mb-4">
                  <Avatar className="w-24 h-24 border-4 border-background ring-2 ring-primary">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-2xl font-bold">{formData.displayName || 'Anonymous User'}</h2>
                <p className="text-muted-foreground text-sm">
                  Member since {profile?.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'recently'}
                </p>
                <div className="mt-6 space-y-2 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm font-medium">
                    <Heart className="w-4 h-4 text-primary" /> Fitness Enthusiast
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm font-medium">
                    <Shield className="w-4 h-4 text-primary" /> Active Tracker
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Account
                </TabsTrigger>
                <TabsTrigger value="goals" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Goals
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Update your personal information and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={formData.displayName} 
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <Button className="w-full md:w-auto mt-4" onClick={handleSaveAccount}>
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle>Dietary Goals</CardTitle>
                    <CardDescription>Adjust your daily targets based on your current fitness journey.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="calories">Daily Calorie Target (kcal)</Label>
                      <Input 
                        id="calories" 
                        type="number" 
                        value={formData.dailyCalorieGoal} 
                        onChange={(e) => setFormData({...formData, dailyCalorieGoal: Number(e.target.value)})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input 
                          id="protein" 
                          type="number" 
                          value={formData.dailyProteinGoalGrams} 
                          onChange={(e) => setFormData({...formData, dailyProteinGoalGrams: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input 
                          id="carbs" 
                          type="number" 
                          value={formData.dailyCarbGoalGrams} 
                          onChange={(e) => setFormData({...formData, dailyCarbGoalGrams: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input 
                          id="fat" 
                          type="number" 
                          value={formData.dailyFatGoalGrams} 
                          onChange={(e) => setFormData({...formData, dailyFatGoalGrams: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary flex items-center gap-2">
                        <Info className="w-4 h-4" /> Pro Tip: High protein diets help maintain muscle mass while losing fat.
                      </p>
                    </div>
                    <Button className="w-full md:w-auto" onClick={handleUpdateGoals}>
                      Update Targets
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when we reach out to you.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl border opacity-50 cursor-not-allowed">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Log Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get notified if you forget to log a meal.</p>
                      </div>
                      <div className="w-12 h-6 bg-muted rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border opacity-50 cursor-not-allowed">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Weekly Report</h4>
                        <p className="text-sm text-muted-foreground">Receive a detailed summary of your nutrition trends.</p>
                      </div>
                      <div className="w-12 h-6 bg-muted rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <p className="text-xs text-center text-muted-foreground italic">Notifications are coming soon!</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
