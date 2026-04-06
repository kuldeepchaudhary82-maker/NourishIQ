import { Request, Response } from 'express';
import prisma from '../utils/prisma';

// Health Tips
export const getHealthTips = async (req: Request, res: Response) => {
  try {
    const tips = await prisma.contentLibrary.findMany({
      where: { type: 'TIP' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tips);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createHealthTip = async (req: Request, res: Response) => {
  try {
    const { title, body, tags, targetTier } = req.body;
    const tip = await prisma.contentLibrary.create({
      data: {
        type: 'TIP',
        title,
        body,
        tags,
        targetTier,
        createdBy: (req as any).user.userId,
      },
    });
    res.status(201).json(tip);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Food Database
export const searchFood = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const foods = await prisma.foodDatabase.findMany({
      where: {
        OR: [
          { name: { contains: String(query), mode: 'insensitive' } },
          { category: { contains: String(query), mode: 'insensitive' } },
        ],
      },
    });
    res.json(foods);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addFoodItem = async (req: Request, res: Response) => {
  try {
    const food = await prisma.foodDatabase.create({
      data: req.body,
    });
    res.status(201).json(food);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Educational Articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.contentLibrary.findMany({
      where: { type: 'ARTICLE' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(articles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, body, tags, targetTier } = req.body;
    const article = await prisma.contentLibrary.create({
      data: {
        type: 'ARTICLE',
        title,
        body,
        tags,
        targetTier,
        createdBy: (req as any).user.userId,
      },
    });
    res.status(201).json(article);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const content = await prisma.contentLibrary.update({
      where: { id },
      data: req.body,
    });
    res.json(content);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contentLibrary.delete({ where: { id } });
    res.json({ message: 'Content deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFoodItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const food = await prisma.foodDatabase.update({
      where: { id },
      data: req.body,
    });
    res.json(food);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFoodItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.foodDatabase.delete({ where: { id } });
    res.json({ message: 'Food item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
