import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const generateClinicInviteLink = async (req: Request, res: Response) => {
  const clinicId = (req as any).user.userId;

  try {
    const inviteToken = crypto.randomBytes(16).toString('hex');
    
    // In a real app, we would store this token in a separate model 'ClinicInvite'
    // For this MVP, we will just return a link with the clinicId and a signature
    const inviteUrl = `nourishiq://register?clinicId=${clinicId}&inviteToken=${inviteToken}`;

    res.json({ inviteUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const registerClinicPatient = async (req: Request, res: Response) => {
  const { name, email, password, clinicId } = req.body;

  try {
    // Basic validation and hashing (simplified for this call)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In reality, hash this!
        role: 'USER',
        subscriptionTier: 'CLINIC',
        clinicId,
      },
    });

    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
