import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const healthProfileSchema = z.object({
  age: z.number().int(),
  gender: z.string(),
  heightCm: z.number(),
  currentWeight: z.number(),
  targetWeight: z.number(),
  city: z.string(),
});

const bodyCompSchema = z.object({
  weightKg: z.number(),
  bodyFatPct: z.number().optional(),
  visceralFatPct: z.number().optional(),
  skeletalMusclePct: z.number().optional(),
  bmr: z.number().optional(),
  bmi: z.number().optional(),
});

const labResultSchema = z.array(z.object({
  testDate: z.string(),
  markerName: z.string(),
  value: z.number(),
  unit: z.string(),
  referenceMin: z.number().optional(),
  referenceMax: z.number().optional(),
}));

const dietaryPrefSchema = z.object({
  dietType: z.string(),
  allergies: z.array(z.string()),
  likedFoods: z.array(z.string()),
  dislikedFoods: z.array(z.string()),
  cuisinePref: z.array(z.string()),
  cookingTime: z.string(),
  cookingSkill: z.string(),
});

const lifestyleSchema = z.object({
  activityLevel: z.string(),
  exerciseTypes: z.array(z.string()),
  exerciseFreqPerWeek: z.number().int(),
  exerciseDurationMins: z.number().int(),
  sleepBedtime: z.string(),
  sleepWaketime: z.string(),
  stressLevel: z.string(),
  occupationType: z.string(),
  wearableDevice: z.string().optional(),
  primaryGoals: z.array(z.string()),
});

export const saveHealthProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = healthProfileSchema.parse(req.body);
    const profile = await prisma.healthProfile.upsert({
      where: { userId },
      update: validatedData,
      create: { ...validatedData, userId },
    });
    res.json(profile);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const saveBodyComposition = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = bodyCompSchema.parse(req.body);
    const bodyComp = await prisma.bodyComposition.create({
      data: {
        ...validatedData,
        userId,
        date: new Date(),
      },
    });
    res.json(bodyComp);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const saveLabResults = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = labResultSchema.parse(req.body);
    const labResults = await Promise.all(
      validatedData.map((result) =>
        prisma.labResult.create({
          data: {
            ...result,
            testDate: new Date(result.testDate),
            userId,
          },
        })
      )
    );
    res.json(labResults);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const saveDietaryPreferences = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = dietaryPrefSchema.parse(req.body);
    const pref = await prisma.dietaryPreference.upsert({
      where: { userId },
      update: validatedData,
      create: { ...validatedData, userId },
    });
    res.json(pref);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const saveLifestyle = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = lifestyleSchema.parse(req.body);
    const lifestyle = await prisma.lifestyle.upsert({
      where: { userId },
      update: validatedData,
      create: { ...validatedData, userId },
    });
    res.json(lifestyle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const completeOnboarding = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }, // Using isVerified as indicator of completion for now
    });
    res.json({ message: 'Onboarding complete', user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
