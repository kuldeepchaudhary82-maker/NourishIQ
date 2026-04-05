import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const generatePlanWithClaude = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      healthProfile: true,
      labResults: true,
      dietaryPrefs: true,
      lifestyle: true,
    },
  });

  if (!user || !user.healthProfile) {
    throw new Error('User health profile not found');
  }

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const city = user.healthProfile.city;

  const systemPrompt = `You are a clinical sports nutritionist and registered dietitian.
  Generate a complete personalised 7-day nutrition and supplement plan in valid JSON only.
  No explanation text. Pure JSON matching the schema exactly.
  Rules:
  - No meal repeats within the 7-day cycle
  - Respect all dietary restrictions and allergies strictly
  - Use seasonal vegetables for the user's city and current month
  - Calculate macros using Mifflin-St Jeor with activity multiplier
  - Every recommendation must cite the specific lab value that triggered it
  - Include Indian food brand names for supplements where possible
  - Flag any supplement requiring doctor consultation
  
  JSON Schema Structure:
  {
    "calorieTargets": { "daily": number, "protein": number, "carbs": number, "fat": number },
    "macroTargets": { "proteinPct": number, "carbsPct": number, "fatPct": number },
    "mealPlan": [
      {
        "day": 1,
        "meals": [
          { "slot": "breakfast", "name": string, "time": "08:00 AM", "macros": { "kcal": number, "protein": number, "carbs": number, "fat": number }, "ingredients": [{ "item": string, "amount": string }], "prep": string }
        ]
      }
    ],
    "supplementStack": [
      { "name": string, "dosage": string, "timing": string, "reason": string, "brand": string, "requiresDoc": boolean }
    ],
    "dailySchedule": [
      { "time": string, "activity": string, "type": "MEAL" | "SUPPLEMENT" | "LIFESTYLE" }
    ],
    "labFlags": [
      { "marker": string, "finding": string, "recommendation": string }
    ],
    "lifestyleProtocol": { "sleep": string, "exercise": string, "stress": string }
  }`;

  const userContext = `
  User Profile: ${JSON.stringify(user.healthProfile)}
  Lab Results: ${JSON.stringify(user.labResults)}
  Dietary Preferences: ${JSON.stringify(user.dietaryPrefs)}
  Lifestyle: ${JSON.stringify(user.lifestyle)}
  Season and City: ${currentMonth}, ${city}
  `;

  const response = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229", // Using valid model name from SDK
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: "Generate my personalised plan as JSON based on the provided profile." }],
  });

  const content = (response.content[0] as any).text;
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse Claude response:', content);
    throw new Error('AI generated invalid JSON format');
  }
};
