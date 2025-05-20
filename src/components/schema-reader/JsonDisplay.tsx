"use client";

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, AlertTriangle, Copy, Loader2, FileJson2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface JsonDisplayProps {
  formattedJson: string | null;
  isLoading: boolean;
  error: string | null;
}

export function JsonDisplay({ formattedJson, isLoading, error }: JsonDisplayProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    if (formattedJson) {
      navigator.clipboard.writeText(formattedJson)
        .then(() => {
          toast({ title: "Copied!", description: "Formatted JSON copied to clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy text.", variant: "destructive" });
          console.error('Failed to copy text: ', err);
        });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center text-muted-foreground p-4">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Processing and formatting JSON...</span>
        </div>
        <Skeleton className="h-[200px] w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    );
  }

  if (error && !formattedJson) { // Only show error if there's no JSON to display
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Processing Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!formattedJson && !error && !isLoading) {
    return (
      <div className="text-center text-muted-foreground p-8 border border-dashed rounded-lg">
        <FileJson2 className="mx-auto h-12 w-12 mb-2" />
        <p>Your validated and formatted JSON will appear here.</p>
      </div>
    );
  }
  
  // If there's an error but also some (possibly partial) formattedJson, show the JSON
  // This can happen if OCR worked but validation failed, and the AI still returned something.
  // The main page error handling above this component will show a more general error.

  return (
    <div className="space-y-4">
      {formattedJson && (
        <>
        <Alert variant={error ? "destructive" : "default"}>
          {error ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <AlertTitle>{error ? "Potential Issues" : "Success"}</AlertTitle>
          <AlertDescription>
            {error ? `There was an issue: ${error}. The JSON below might be incomplete or incorrect.` : "JSON content validated and formatted successfully."}
          </AlertDescription>
        </Alert>
        <Textarea
            value={formattedJson}
            readOnly
            rows={15}
            className="min-h-[300px] text-sm font-mono bg-input/30 focus:bg-background"
            aria-label="Formatted JSON Output"
          />
          <Button onClick={handleCopy} variant="outline" className="w-full">
            <Copy className="mr-2 h-4 w-4" /> Copy JSON
          </Button>
        </>
      )}
    </div>
  );
}
