import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { Tier } from '@prisma/client';
import prisma from '../utils/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createSubscription = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { planId } = req.body; // Razorpay Plan ID

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // For a year if monthly
    });

    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyWebhook = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'] as string;
  
  const body = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).send('Invalid signature');
  }

  const { event, payload } = req.body;
  const razorpaySubId = payload.subscription.entity.id;
  const razorpayCustomerId = payload.subscription.entity.customer_id;

  switch (event) {
    case 'subscription.activated':
    case 'subscription.charged':
      // Map Razorpay plan to our Tier
      const tierMap: { [key: string]: Tier } = {
        'plan_123': Tier.CORE, // Replace with actual IDs
        'plan_456': Tier.PRO,
      };
      const tier = tierMap[payload.subscription.entity.plan_id] || Tier.CORE;

      await prisma.user.update({
        where: { id: payload.subscription.entity.notes.userId },
        data: {
          subscriptionTier: tier,
          subscription: {
            upsert: {
              create: {
                tier,
                status: 'active',
                startedAt: new Date(),
                razorpaySubId,
                razorpayCustomerId,
              },
              update: {
                tier,
                status: 'active',
                razorpaySubId,
                razorpayCustomerId,
              },
            },
          },
        },
      });
      break;

    case 'subscription.cancelled':
      await prisma.subscription.updateMany({
        where: { razorpaySubId },
        data: { status: 'cancelled', cancelledAt: new Date() },
      });
      break;
  }

  res.json({ status: 'ok' });
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });
    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
