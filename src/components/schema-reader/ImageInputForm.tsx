"use client";

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Link2, Loader2 } from 'lucide-react';
import { convertUrlToDataUri } from '@/lib/utils';

interface ImageInputFormProps {
  onImageReady: (dataUri: string | null, previewUri: string | null, error?: string) => void;
  isProcessing: boolean;
}

export function ImageInputForm({ onImageReady, isProcessing }: ImageInputFormProps) {
  const [urlInput, setUrlInput] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // To reset file input
  const [isUrlLoading, setIsUrlLoading] = useState(false);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUri = reader.result as string;
          onImageReady(dataUri, dataUri);
          setUrlInput(''); // Clear URL input
        };
        reader.onerror = () => {
          onImageReady(null, null, 'Error reading file.');
        }
        reader.readAsDataURL(file);
      } catch (error) {
        onImageReady(null, null, 'Error processing file.');
      }
    }
    // Reset file input to allow re-uploading the same file after clearing
    setFileInputKey(Date.now()); 
  }, [onImageReady]);

  const handleProcessUrl = useCallback(async () => {
    if (!urlInput.trim()) {
      onImageReady(null, null, 'Please enter an image URL.');
      return;
    }
    setIsUrlLoading(true);
    try {
      const dataUri = await convertUrlToDataUri(urlInput);
      onImageReady(dataUri, dataUri); // For image URLs, dataUri is also the previewUri
      setFileInputKey(Date.now()); // Clear file input
    } catch (error: any) {
      console.error('Error converting URL to Data URI:', error);
      let errorMessage = 'Failed to load image from URL. Ensure the URL is correct and publicly accessible.';
      if (error.message && error.message.includes('CORS')) {
          errorMessage = 'Failed to load image due to CORS policy. Try uploading the image directly.';
      } else if (error.message) {
          errorMessage = `Failed to load image: ${error.message}`;
      }
      onImageReady(null, null, errorMessage);
    } finally {
      setIsUrlLoading(false);
    }
  }, [urlInput, onImageReady]);

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4" />Upload File</TabsTrigger>
        <TabsTrigger value="url"><Link2 className="mr-2 h-4 w-4" />From URL</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <div className="space-y-2">
          <Label htmlFor="image-file">Upload an image file</Label>
          <Input 
            id="image-file" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            disabled={isProcessing || isUrlLoading}
            key={fileInputKey} 
            className="file:text-primary file:font-semibold hover:file:bg-primary/10"
          />
        </div>
      </TabsContent>
      <TabsContent value="url">
        <div className="space-y-2">
          <Label htmlFor="image-url">Or enter image URL</Label>
          <div className="flex space-x-2">
            <Input 
              id="image-url" 
              type="url" 
              placeholder="https://example.com/image.png" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={isProcessing || isUrlLoading}
            />
            <Button onClick={handleProcessUrl} disabled={isProcessing || isUrlLoading || !urlInput.trim()}>
              {isUrlLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Load'}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
