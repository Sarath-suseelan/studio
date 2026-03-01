
'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MOCK_USER_GOALS } from '@/lib/mock-data';
import { Settings, User, Bell, Shield, Heart } from 'lucide-react';

export default function ProfilePage() {
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
                    <AvatarImage src="https://picsum.photos/seed/user/200/200" />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-2xl font-bold">Alex Mentor</h2>
                <p className="text-muted-foreground text-sm">Joined October 2023</p>
                <div className="mt-6 space-y-2 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm font-medium">
                    <Heart className="w-4 h-4 text-primary" /> Fitness Enthusiast
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm font-medium">
                    <Shield className="w-4 h-4 text-primary" /> Premium Member
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Alex" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Mentor" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue="alex@macromentor.ai" />
                    </div>
                    <Button className="w-full md:w-auto mt-4">Save Changes</Button>
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
                      <Input id="calories" type="number" defaultValue={MOCK_USER_GOALS.calories} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input id="protein" type="number" defaultValue={MOCK_USER_GOALS.protein} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input id="carbs" type="number" defaultValue={MOCK_USER_GOALS.carbs} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input id="fat" type="number" defaultValue={MOCK_USER_GOALS.fat} />
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-primary flex items-center gap-2">
                        <InfoIcon className="w-4 h-4" /> Pro Tip: High protein diets help maintain muscle mass while losing fat.
                      </p>
                    </div>
                    <Button className="w-full md:w-auto">Update Targets</Button>
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
                    <div className="flex items-center justify-between p-4 rounded-xl border">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Log Reminders</h4>
                        <p className="text-sm text-muted-foreground">Get notified if you forget to log a meal.</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border">
                      <div className="space-y-1">
                        <h4 className="font-semibold">Weekly Report</h4>
                        <p className="text-sm text-muted-foreground">Receive a detailed summary of your nutrition trends.</p>
                      </div>
                      <div className="w-12 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
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

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
