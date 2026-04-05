import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as aiService from '../services/ai.service';

const prisma = new PrismaClient();

export const generatePlan = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const planJson = await aiService.generatePlanWithClaude(userId);
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 28); // Valid for 4 weeks

    const plan = await prisma.generatedPlan.create({
      data: {
        userId,
        validUntil,
        calorieTargets: planJson.calorieTargets,
        macroTargets: planJson.macroTargets,
        mealPlan: planJson.mealPlan,
        supplementStack: planJson.supplementStack,
        dailySchedule: planJson.dailySchedule,
        labFlags: planJson.labFlags,
        lifestyleProtocol: planJson.lifestyleProtocol,
        isActive: true,
      },
    });

    // Deactivate old plans
    await prisma.generatedPlan.updateMany({
      where: { userId, id: { not: plan.id } },
      data: { isActive: false },
    });

    res.json(plan);
  } catch (error: any) {
    console.error('Plan generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentPlan = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const plan = await prisma.generatedPlan.findFirst({
      where: { userId, isActive: true },
      orderBy: { generatedAt: 'desc' },
    });
    
    if (!plan) return res.status(404).json({ message: 'No active plan found' });
    res.json(plan);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const plans = await prisma.generatedPlan.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });
    res.json(plans);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
