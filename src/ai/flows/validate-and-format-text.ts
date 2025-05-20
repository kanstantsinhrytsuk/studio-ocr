'use server';

/**
 * @fileOverview Validates and formats extracted text according to a provided JSON schema.
 *
 * - validateAndFormatText - A function that handles the validation and formatting process.
 * - ValidateAndFormatTextInput - The input type for the validateAndFormatText function.
 * - ValidateAndFormatTextOutput - The return type for the validateAndFormatText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateAndFormatTextInputSchema = z.object({
  extractedText: z.string().describe('The text extracted from the image using OCR.'),
  jsonSchema: z.string().describe('The JSON schema to use for validation and formatting.'),
});
export type ValidateAndFormatTextInput = z.infer<typeof ValidateAndFormatTextInputSchema>;

const ValidateAndFormatTextOutputSchema = z.object({
  formattedJson: z.string().describe('The validated and formatted JSON content.'),
});
export type ValidateAndFormatTextOutput = z.infer<typeof ValidateAndFormatTextOutputSchema>;

export async function validateAndFormatText(input: ValidateAndFormatTextInput): Promise<ValidateAndFormatTextOutput> {
  return validateAndFormatTextFlow(input);
}

const validateAndFormatTextPrompt = ai.definePrompt({
  name: 'validateAndFormatTextPrompt',
  input: {schema: ValidateAndFormatTextInputSchema},
  output: {schema: ValidateAndFormatTextOutputSchema},
  prompt: `You are a data transformation expert. You will receive text extracted from an image and a JSON schema.
Your task is to validate the extracted text against the provided JSON schema, and format the extracted text into a JSON object that conforms to the schema.

Extracted Text: {{{extractedText}}}

JSON Schema: {{{jsonSchema}}}

Output the formatted JSON object.`, // Enforce json output using type hints in prompt
});

const validateAndFormatTextFlow = ai.defineFlow(
  {
    name: 'validateAndFormatTextFlow',
    inputSchema: ValidateAndFormatTextInputSchema,
    outputSchema: ValidateAndFormatTextOutputSchema,
  },
  async input => {
    const {output} = await validateAndFormatTextPrompt(input);
    return output!;
  }
);
