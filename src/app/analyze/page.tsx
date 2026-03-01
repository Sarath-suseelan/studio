
'use client';

import { useState, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { aiMacroAnalysis, AIMacroAnalysisOutput } from '@/ai/flows/ai-macro-analysis';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useUser, useFirestore } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function AnalyzePage() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIMacroAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useUser();
  const { firestore } = useFirestore();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Client-side image compression and resizing
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new (window as any).Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to compressed JPEG data URI
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImage(compressedDataUrl);
          setResult(null);
          setError(null);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const output = await aiMacroAnalysis({ photoDataUri: image });
      setResult(output);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again with a clearer photo or check your connection.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogMeal = async () => {
    if (!user || !firestore || !result) return;

    const totalCalories = result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.calories, 0);
    const totalProtein = result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.protein, 0);
    const totalCarbs = result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.carbs, 0);
    const totalFat = result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.fat, 0);

    const logId = doc(collection(firestore, 'placeholder')).id;
    const mealLogRef = doc(firestore, 'users', user.uid, 'meal_logs', logId);
    
    setDocumentNonBlocking(mealLogRef, {
      id: logId,
      userId: user.uid,
      logDateTime: new Date().toISOString(),
      mealType: 'AI Analysis',
      name: result.foodItems.map(i => i.name).join(', '),
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      createdAt: serverTimestamp(),
      source: 'ai_analysis'
    }, { merge: true });

    toast({
      title: "Success",
      description: "AI-analyzed meal has been added to your log.",
    });

    window.location.href = '/dashboard';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex flex-col gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-headline font-bold">AI Macro Analysis</h1>
            <p className="text-muted-foreground">Snap a photo and let AI do the counting for you.</p>
          </div>

          <Card className="border-2 border-dashed border-primary/20 bg-muted/30 overflow-hidden relative">
            <CardContent className="p-0">
              {image ? (
                <div className="relative aspect-video group">
                  <Image src={image} alt="Food to analyze" fill className="object-cover" />
                  {!analyzing && !result && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" onClick={resetAnalysis}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Change Image
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="py-20 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={triggerFileInput}
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Upload your meal photo</h3>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG or JPEG (Max 10MB)</p>
                  <Button variant="outline" className="mt-4">
                    <Upload className="w-4 h-4 mr-2" /> Choose File
                  </Button>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </CardContent>
          </Card>

          {image && !result && (
            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20" 
              disabled={analyzing}
              onClick={handleAnalyze}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing Nutrition...
                </>
              ) : (
                'Analyze This Meal'
              )}
            </Button>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" /> Analysis Complete
                  </CardTitle>
                  <CardDescription>We've identified the following items and macros.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <div className="text-2xl font-black text-primary">
                        {Math.round(result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.calories, 0))}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Calories</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <div className="text-2xl font-black text-secondary">
                        {Math.round(result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.protein, 0))}g
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Protein</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <div className="text-2xl font-black text-chart-3">
                        {Math.round(result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.carbs, 0))}g
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Carbs</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl shadow-sm border text-center">
                      <div className="text-2xl font-black text-chart-4">
                        {Math.round(result.foodItems.reduce((acc, curr) => acc + curr.estimatedMacros.fat, 0))}g
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Fat</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Breakdown</h4>
                    {result.foodItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-muted-foreground">P: {item.estimatedMacros.protein}g • C: {item.estimatedMacros.carbs}g • F: {item.estimatedMacros.fat}g</p>
                        </div>
                        <div className="font-bold text-primary">{Math.round(item.estimatedMacros.calories)} kcal</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-white rounded-xl border italic text-sm text-muted-foreground leading-relaxed">
                    "{result.overallSummary}"
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={handleLogMeal}>
                      Log This Meal
                    </Button>
                    <Button variant="outline" onClick={resetAnalysis}>
                      Scan Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
