import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getRevenueStats = async (req: Request, res: Response) => {
  try {
    const activeSubscriptions = await prisma.subscription.findMany({
      where: { status: 'active' },
      select: { tier: true },
    });

    const tierPricing: { [key: string]: number } = {
      CORE: 499,
      PRO: 999,
      CLINIC: 2999,
    };

    const mrr = activeSubscriptions.reduce((acc, sub) => acc + (tierPricing[sub.tier] || 0), 0);
    const arr = mrr * 12;

    const tierBreakdown = activeSubscriptions.reduce((acc: any, sub) => {
      acc[sub.tier] = (acc[sub.tier] || 0) + 1;
      return acc;
    }, {});

    res.json({
      mrr,
      arr,
      tierBreakdown,
      totalActive: activeSubscriptions.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserGrowthStats = async (req: Request, res: Response) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const signups = await prisma.user.findMany({
      where: { createdAt: { gte: last30Days } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const growthData = signups.reduce((acc: any, user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(growthData).map(([date, count]) => ({
      date,
      count,
    }));

    res.json(chartData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeatureUsageStats = async (req: Request, res: Response) => {
  try {
    const [mealLogs, supplementLogs, aiChats, planGens] = await Promise.all([
      prisma.mealLog.count(),
      prisma.supplementLog.count(),
      prisma.aiConversation.count(),
      prisma.generatedPlan.count(),
    ]);

    res.json({
      mealLogs,
      supplementLogs,
      aiChats,
      planGens,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const { status, tier, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (status) where.status = status;
    if (tier) where.tier = tier;

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        skip,
        take: Number(limit),
        include: { user: { select: { name: true, email: true } } },
        orderBy: { startedAt: 'desc' },
      }),
      prisma.subscription.count({ where }),
    ]);

    res.json({ subscriptions, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
