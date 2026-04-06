import prisma from '../utils/prisma';
import { Anthropic } from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const generateWeeklyReport = async (userId: string) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  try {
    const [user, meals, supplements, bodyComp] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, include: { healthProfile: true } }),
      prisma.mealLog.findMany({ where: { userId, date: { gte: startDate, lte: endDate } } }),
      prisma.supplementLog.findMany({ where: { userId, date: { gte: startDate, lte: endDate } } }),
      prisma.bodyComposition.findMany({ where: { userId, date: { gte: startDate, lte: endDate } }, orderBy: { date: 'desc' } }),
    ]);

    if (!user) return;

    const mealStats = meals.reduce((acc, m) => {
      acc.total += 1;
      if (m.mealSlot !== "SNACK") acc.mainMeals += 1;
      return acc;
    }, { total: 0, mainMeals: 0 });

    const adherence = Math.min(100, (mealStats.total / 21) * 100); // 21 meals/week target

    const prompt = `You are a health optimization AI. Analyze the following health data for a user for the past 7 days and generate a weekly report.
    User Info: ${JSON.stringify(user.healthProfile)}
    Meals Logged: ${meals.length}
    Supplements Logged: ${supplements.length}
    Weight Trend: ${bodyComp.map(b => `${b.date.toISOString().split('T')[0]}: ${b.weightKg}kg`).join(', ')}

    Return a JSON object:
    {
      "summary": "A 3-4 sentence encouraging summary of their week",
      "adherence": number (0-100),
      "insights": ["insight 1", "insight 2"],
      "recommendations": ["rec 1", "rec 2"]
    }
    Only return the JSON object.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      system: 'You are a professional nutritionist AI reporting to a client.',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type === 'text') {
      const data = JSON.parse(content.text);

      const report = await prisma.weeklyReport.create({
        data: {
          userId,
          startDate,
          endDate,
          summary: data.summary,
          adherence: data.adherence,
          insights: data.insights,
          recommendations: data.recommendations,
        },
      });

      return report;
    }
  } catch (error) {
    console.error(`Failed to generate weekly report for user ${userId}:`, error);
  }
};

export const runWeeklyReportJob = async () => {
  const users = await prisma.user.findMany({
    where: { role: 'USER', subscriptionTier: { in: ['CORE', 'PRO', 'CLINIC'] } },
    select: { id: true },
  });

  console.log(`Starting weekly report generation for ${users.length} users...`);
  for (const user of users) {
    await generateWeeklyReport(user.id);
  }
  console.log('Weekly report job completed.');
};
