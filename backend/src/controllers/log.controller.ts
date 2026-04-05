import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const mealLogSchema = z.object({
  date: z.string(),
  mealSlot: z.string(),
  plannedMeal: z.string().optional(),
  loggedMeal: z.string(),
  proteinG: z.number().optional(),
  carbsG: z.number().optional(),
  fatG: z.number().optional(),
  kcal: z.number().optional(),
  status: z.string(),
  notes: z.string().optional(),
});

const supplementLogSchema = z.object({
  date: z.string(),
  supplementName: z.string(),
  doseAmount: z.string(),
  scheduledTime: z.string(),
  status: z.string(),
});

const activityLogSchema = z.object({
  date: z.string(),
  source: z.string(),
  steps: z.number().int().optional(),
  activeCalories: z.number().optional(),
  exerciseMins: z.number().int().optional(),
  sleepHours: z.number().optional(),
  restingHR: z.number().int().optional(),
  waterMl: z.number().int().optional(),
});

export const logMeal = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = mealLogSchema.parse(req.body);
    const log = await prisma.mealLog.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId,
      },
    });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logSupplement = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = supplementLogSchema.parse(req.body);
    const log = await prisma.supplementLog.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        takenAt: validatedData.status === 'TAKEN' ? new Date() : null,
        userId,
      },
    });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logActivity = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const validatedData = activityLogSchema.parse(req.body);
    const log = await prisma.activityLog.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        userId,
      },
    });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDaySummary = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { date } = req.params;
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  try {
    const [meals, supplements, activities] = await Promise.all([
      prisma.mealLog.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      prisma.supplementLog.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
      prisma.activityLog.findMany({
        where: { userId, date: { gte: startOfDay, lte: endOfDay } },
      }),
    ]);

    const totals = meals.reduce((acc, meal) => ({
      kcal: acc.kcal + (meal.kcal || 0),
      protein: acc.protein + (meal.proteinG || 0),
      carbs: acc.carbs + (meal.carbsG || 0),
      fat: acc.fat + (meal.fatG || 0),
    }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });

    res.json({ meals, supplements, activities, totals });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const syncActivity = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { date, steps, activeCalories, source } = req.body;
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  try {
    const existingLog = await prisma.activityLog.findFirst({
      where: { userId, date: { gte: startOfDay, lte: endOfDay }, source },
    });

    if (existingLog) {
      const updated = await prisma.activityLog.update({
        where: { id: existingLog.id },
        data: { 
          steps: steps || existingLog.steps,
          activeCalories: activeCalories || existingLog.activeCalories 
        },
      });
      res.json(updated);
    } else {
      const created = await prisma.activityLog.create({
        data: {
          userId,
          date: startOfDay,
          source,
          steps,
          activeCalories,
        },
      });
      res.json(created);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
