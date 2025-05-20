
"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { AppHeader } from '@/components/layout/AppHeader';
import { ImageInputForm } from '@/components/schema-reader/ImageInputForm';
import { SchemaInputForm } from '@/components/schema-reader/SchemaInputForm';
import { JsonDisplay } from '@/components/schema-reader/JsonDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from "@/hooks/use-toast";
// Removed AI flow imports as they are Server Actions
// import { extractTextFromImage } from '@/ai/flows/extract-text-from-image';
// import { validateAndFormatText } from '@/ai/flows/validate-and-format-text';
import { FileImage, Braces, FileJson2, Sparkles, Loader2, AlertTriangle } from 'lucide-react';

export default function SchemaReaderPage() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [jsonSchema, setJsonSchema] = useState<string>('');
  const [formattedJson, setFormattedJson] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentProcessStep, setCurrentProcessStep] = useState<'ocr' | 'validation' | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [outputError, setOutputError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleImageProcessed = useCallback((dataUri: string | null, previewUri: string | null, errorMessage?: string) => {
    if (errorMessage) {
      setGeneralError(errorMessage);
      setPhotoDataUri(null);
      setImagePreview(null);
      toast({ title: "Image Error", description: errorMessage, variant: "destructive" });
    } else {
      setPhotoDataUri(dataUri);
      setImagePreview(previewUri);
      setGeneralError(null); 
    }
  }, [toast]);

  const handleSubmit = async () => {
    if (!photoDataUri) {
      setGeneralError('Please provide an image first.');
      toast({ title: "Input Missing", description: "Please provide an image first.", variant: "destructive" });
      return;
    }
    if (!jsonSchema.trim()) {
      setGeneralError('Please provide a JSON schema.');
      toast({ title: "Input Missing", description: "Please provide a JSON schema.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setGeneralError(null);
    setOutputError(null);
    setFormattedJson(null);
    setCurrentProcessStep('ocr');
    toast({ title: "Processing...", description: "Simulating AI processing..." });

    // Simulate AI processing for static deployment
    setTimeout(() => {
      setCurrentProcessStep('validation');
      const simulatedOutput = {
        message: "AI features (OCR and validation) are not available in this static deployment.",
        note: "This is placeholder data because the application is running in a static environment (e.g., GitHub Pages) that does not support server-side AI processing.",
        providedSchema: jsonSchema ? "Schema was provided by user." : "No schema provided by user.",
        imageProvided: photoDataUri ? "Image was provided." : "No image provided."
      };
      setFormattedJson(JSON.stringify(simulatedOutput, null, 2));
      toast({ title: "Static Mode", description: "AI features simulated. Full functionality requires a server environment.", variant: "default" });
      setIsLoading(false);
      setCurrentProcessStep(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Column */}
          <div className="space-y-8">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><FileImage className="w-6 h-6 text-primary" /> Image Input</CardTitle>
                <CardDescription>Upload an image or provide a URL.</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageInputForm onImageReady={handleImageProcessed} isProcessing={isLoading && currentProcessStep === 'ocr'} />
                {imagePreview && (
                  <div className="mt-6 border rounded-lg p-4 bg-muted/30 shadow-inner">
                    <p className="text-sm font-semibold mb-2 text-center text-foreground/80">Image Preview:</p>
                    <div className="flex justify-center items-center max-h-[300px] overflow-hidden rounded-md">
                       <Image src={imagePreview} alt="Preview" width={400} height={300} className="object-contain max-h-[300px] max-w-full rounded-md" data-ai-hint="abstract preview" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Braces className="w-6 h-6 text-primary" /> JSON Schema</CardTitle>
                <CardDescription>Paste your JSON schema (used for simulated output in static mode).</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemaInputForm jsonSchema={jsonSchema} onJsonSchemaChange={setJsonSchema} disabled={isLoading} />
              </CardContent>
            </Card>

            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !photoDataUri || !jsonSchema.trim()} 
              className="w-full py-3 text-lg rounded-lg shadow-md hover:shadow-lg transition-shadow bg-accent hover:bg-accent/90 text-accent-foreground" 
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing {currentProcessStep === 'ocr' ? 'Image' : currentProcessStep === 'validation' ? 'Schema' : ''}...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Process (Simulated)
                </>
              )}
            </Button>
            {generalError && !isLoading && (
              <Alert variant="destructive" className="mt-4 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Input Error</AlertTitle>
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Output Column */}
          <div className="lg:sticky lg:top-24"> {/* Sticky for desktop, adjusted top for header */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><FileJson2 className="w-6 h-6 text-primary" /> Formatted JSON Output</CardTitle>
                <CardDescription>Simulated output based on your input (AI features disabled in static mode).</CardDescription>
              </CardHeader>
              <CardContent>
                <JsonDisplay 
                  formattedJson={formattedJson} 
                  isLoading={isLoading && (currentProcessStep === 'validation' || (currentProcessStep === 'ocr' && !outputError) ) }
                  error={outputError} 
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
