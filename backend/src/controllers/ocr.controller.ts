import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as ocrService from '../services/ocr.service';
import { createAuditLog } from './admin.controller';

const prisma = new PrismaClient();

export const uploadAndProcessLabReport = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const extractedData = await ocrService.extractBiomarkersFromPdf(req.file.buffer);

    // Log the OCR usage
    await createAuditLog(userId, 'LAB_OCR_PROCESS', `Processed lab report PDF`, 'USER', userId);

    res.json({
      message: 'Report processed successfully',
      data: extractedData,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmLabResults = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { results } = req.body; // Array of markers

  try {
    await prisma.labResult.createMany({
      data: results.map((r: any) => ({
        ...r,
        userId,
        testDate: new Date(r.testDate),
      })),
    });

    res.json({ message: 'Lab results saved successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
