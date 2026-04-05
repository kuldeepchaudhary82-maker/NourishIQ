import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

const prisma = new PrismaClient();

export const createAuditLog = async (adminId: string, action: string, details: string, targetType?: string, targetId?: string) => {
  try {
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        details,
        targetType,
        targetId,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalUsers, activeSubscriptions, dailyMealLogs, pendingAlerts] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.mealLog.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.notification.count({ where: { status: 'pending' } }),
    ]);

    res.json({
      totalUsers,
      activeSubscriptions,
      dailyMealLogs,
      pendingAlerts,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { tier, role, search, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (tier) where.subscriptionTier = tier;
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { email: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          subscriptionTier: true,
          isVerified: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        healthProfile: true,
        bodyCompositions: { orderBy: { date: 'desc' }, take: 10 },
        labResults: { orderBy: { testDate: 'desc' }, take: 20 },
        subscription: true,
        dietaryPrefs: true,
        lifestyle: true,
      },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSubscriptionTier = async (req: Request, res: Response) => {
  try {
    const { userId, tier } = req.body;
    const user = await prisma.user.update({
      where: { id: userId },
      data: { subscriptionTier: tier },
    });
    
    // Log action
    await createAuditLog((req as any).user.userId, 'UPDATE_USER_TIER', `Updated ${user.email} to ${tier}`, 'USER', userId);
    
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const broadcastNotification = async (req: Request, res: Response) => {
  try {
    const { target, title, body, data } = req.body;
    const adminId = (req as any).user.userId;

    let where: any = { role: 'USER' };
    if (target === 'FREE') where.subscriptionTier = 'FREE';
    if (target === 'PRO') where.subscriptionTier = { in: ['CORE', 'PRO', 'CLINIC'] };

    const users = await prisma.user.findMany({
      where,
      select: { id: true, fcmToken: true },
    });

    const tokens = users.map((u) => u.fcmToken).filter(Boolean) as string[];

    if (tokens.length > 0) {
      const message = {
        notification: { title, body },
        data: data || {},
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      
      // Save notifications to DB
      await prisma.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          type: 'BROADCAST',
          title,
          body,
          data: data || {},
          status: 'sent',
          sentAt: new Date(),
        })),
      });

      await createAuditLog(adminId, 'BROADCAST_NOTIFICATION', `Sent "${title}" to ${tokens.length} users`, 'NOTIFICATION');

      res.json({
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
      });
    } else {
      res.status(400).json({ message: 'No recipients found with valid FCM tokens' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const logs = await prisma.auditLog.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
