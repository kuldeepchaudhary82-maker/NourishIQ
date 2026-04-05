import { Anthropic } from '@anthropic-ai/sdk';
import pdf from 'pdf-parse';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const extractBiomarkersFromPdf = async (pdfBuffer: Buffer) => {
  try {
    const data = await pdf(pdfBuffer);
    const text = data.text;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: `You are a medical lab report parser. Extract biomarkers from the provided text into a JSON array.
      Format each item as: { "markerName": string, "value": number, "unit": string, "referenceMin": number, "referenceMax": number, "status": string, "testDate": string (ISO 8601 if possible) }
      Only return the JSON array, no preamble. If a value is missing, return null for that field.`,
      messages: [
        { role: 'user', content: `Extract data from this lab report:\n\n${text}` },
      ],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const parsedData = JSON.parse(content.text);
      return parsedData;
    }
    
    throw new Error('Failed to parse text from Claude response');
  } catch (error: any) {
    console.error('OCR Extraction Error:', error);
    throw new Error('Failed to extract data from PDF: ' + error.message);
  }
};
