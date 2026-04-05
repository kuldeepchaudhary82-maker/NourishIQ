import admin from 'firebase-admin';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const sendPushNotification = async (userId: string, title: string, body: string, data?: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (!user?.fcmToken) {
      console.log(`User ${userId} has no FCM token`);
      return;
    }

    const message = {
      notification: { title, body },
      data: data || {},
      token: user.fcmToken,
    };

    await admin.messaging().send(message);

    // Save to DB
    await prisma.notification.create({
      data: {
        userId,
        title,
        body,
        data: data || {},
        type: data?.type || 'GENERAL',
        status: 'sent',
        sentAt: new Date(),
      },
    });

    console.log(`Notification sent to user ${userId}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const broadcastNotification = async (userIds: string[], title: string, body: string, data?: any) => {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds }, fcmToken: { not: null } },
    select: { id: true, fcmToken: true },
  });

  const messages = users.map(user => ({
    notification: { title, body },
    data: data || {},
    token: user.fcmToken!,
  }));

  if (messages.length > 0) {
    await admin.messaging().sendEach(messages);
    
    // Bulk log notifications
    await prisma.notification.createMany({
      data: users.map(user => ({
        userId: user.id,
        title,
        body,
        data: data || {},
        type: data?.type || 'BROADCAST',
        status: 'sent',
        sentAt: new Date(),
      })),
    });
  }
};
