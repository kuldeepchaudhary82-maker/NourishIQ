import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getWeeklyReports = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const reports = await prisma.weeklyReport.findMany({
      where: { userId },
      orderBy: { endDate: 'desc' },
      take: 12, // Last 3 months
    });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeeklyReportById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.userId;

  try {
    const report = await prisma.weeklyReport.findFirst({
      where: { id, userId },
    });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
