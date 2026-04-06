import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getProgressSummary = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const latestBodyComp = await prisma.bodyComposition.findFirst({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    const firstBodyComp = await prisma.bodyComposition.findFirst({
      where: { userId },
      orderBy: { date: 'asc' },
    });

    const weightChange = (latestBodyComp?.weightKg || 0) - (firstBodyComp?.weightKg || 0);
    const fatChange = (latestBodyComp?.bodyFatPct || 0) - (firstBodyComp?.bodyFatPct || 0);
    const muscleChange = (latestBodyComp?.skeletalMusclePct || 0) - (firstBodyComp?.skeletalMusclePct || 0);

    res.json({
      currentWeight: latestBodyComp?.weightKg || 0,
      weightChange: parseFloat(weightChange.toFixed(1)),
      fatChange: parseFloat(fatChange.toFixed(1)),
      muscleChange: parseFloat(muscleChange.toFixed(1)),
      adherenceScore: 84, // Mocked for now
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeightTrend = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { range = '3M' } = req.query; // 4W, 3M, 6M, 1Y
  
  try {
    const data = await prisma.bodyComposition.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      select: { date: true, weightKg: true },
    });
    
    // Map to Victory format: { x: Date, y: Value }
    const chartData = data.map(item => ({
      x: item.date,
      y: item.weightKg
    }));
    
    res.json(chartData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBodyFatTrend = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const data = await prisma.bodyComposition.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
      select: { date: true, bodyFatPct: true },
    });
    
    const chartData = data.filter(item => item.bodyFatPct !== null).map(item => ({
      x: item.date,
      y: item.bodyFatPct
    }));
    
    res.json(chartData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLabResults = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const results = await prisma.labResult.findMany({
      where: { userId },
      orderBy: { testDate: 'desc' },
    });
    
    // Group by marker name to show latest and history
    const groupedResults = results.reduce((acc: any, curr) => {
      if (!acc[curr.markerName]) acc[curr.markerName] = [];
      acc[curr.markerName].push(curr);
      return acc;
    }, {});
    
    res.json(groupedResults);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
