import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const chatWithCoach = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { message, conversationId } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        healthProfile: true,
        generatedPlans: { where: { isActive: true }, take: 1 },
      },
    });

    let conversation;
    if (conversationId) {
      conversation = await prisma.aiConversation.findUnique({ where: { id: conversationId } });
    }

    const history = conversation ? (conversation.messages as any[]) : [];
    const activePlan = user?.generatedPlans[0];

    const systemPrompt = `You are the user's personal nutrition coach inside NourishIQ.
    Be warm, concise, and actionable. Max 3 sentences per response.
    Never diagnose medical conditions. Always recommend doctor for prescription-level concerns.
    Add disclaimer when discussing supplements.
    User summary: ${JSON.stringify(user?.healthProfile)}
    Active plan: ${JSON.stringify(activePlan)}`;

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [...history.map(m => ({ role: m.role, content: m.content })), { role: "user", content: message }],
    });

    const reply = (response.content[0] as any).text;
    const newMessages = [...history, { role: "user", content: message }, { role: "assistant", content: reply }];

    if (conversationId) {
      await prisma.aiConversation.update({
        where: { id: conversationId },
        data: { messages: newMessages },
      });
      res.json({ reply, conversationId });
    } else {
      const newConv = await prisma.aiConversation.create({
        data: {
          userId,
          messages: newMessages,
        },
      });
      res.json({ reply, conversationId: newConv.id });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const conversations = await prisma.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
