"use client";

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SchemaInputFormProps {
  jsonSchema: string;
  onJsonSchemaChange: (value: string) => void;
  disabled?: boolean;
}

export function SchemaInputForm({ jsonSchema, onJsonSchemaChange, disabled }: SchemaInputFormProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="json-schema">JSON Schema</Label>
      <Textarea
        id="json-schema"
        placeholder={`{\n  "type": "object",\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "number" }\n  }\n}`}
        value={jsonSchema}
        onChange={(e) => onJsonSchemaChange(e.target.value)}
        rows={10}
        className="min-h-[200px] text-sm font-mono bg-input/50 focus:bg-background"
        disabled={disabled}
        aria-label="JSON Schema Input"
      />
    </div>
  );
}
