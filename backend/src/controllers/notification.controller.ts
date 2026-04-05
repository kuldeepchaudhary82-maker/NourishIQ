import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerFcmToken = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { fcmToken } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
    res.json({ message: 'FCM token registered' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    res.json({ message: 'Marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
