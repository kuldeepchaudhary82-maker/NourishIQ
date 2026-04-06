import cron from 'node-cron';
import prisma from '../utils/prisma';
import * as notificationService from '../services/notification.service';
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Daily Health Tip at 7 AM
cron.schedule('0 7 * * *', async () => {
  console.log('Running daily health tip job...');
  const users = await prisma.user.findMany({
    where: { fcmToken: { not: null } },
    include: { labResults: { orderBy: { testDate: 'desc' }, take: 3 } },
  });

  for (const user of users) {
    try {
      const biomarkers = user.labResults.map(r => `${r.markerName}: ${r.value}`).join(', ');
      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 200,
        system: "You are a health coach. Generate 1 highly personalized health tip (max 2 sentences) based on the user's latest biomarkers.",
        messages: [{ role: "user", content: `My biomarkers: ${biomarkers}. Give me today's tip.` }],
      });

      const tip = (response.content[0] as any).text;
      await notificationService.sendPushNotification(user.id, "💡 Today's Health Tip", tip, { type: 'DAILY_TIP' });
    } catch (err) {
      console.error(`Failed tip for user ${user.id}:`, err);
    }
  }
});

// Meal Reminders
const mealTimes = [
  { slot: 'breakfast', cron: '30 7 * * *', label: 'Breakfast', icon: '🍳' },
  { slot: 'lunch', cron: '0 13 * * *', label: 'Lunch', icon: '🥗' },
  { slot: 'dinner', cron: '30 19 * * *', label: 'Dinner', icon: '🍲' },
];

mealTimes.forEach(({ slot, cron: cronExpr, label, icon }) => {
  cron.schedule(cronExpr, async () => {
    console.log(`Running ${slot} reminder job...`);
    const activePlans = await prisma.generatedPlan.findMany({
      where: { isActive: true },
      include: { user: { select: { id: true, fcmToken: true } } },
    });

    for (const plan of activePlans) {
      if (!plan.user.fcmToken) continue;
      
      const mealPlan = plan.mealPlan as any[];
      // Logic for day of cycle: Day 1-7
      const dayOffset = (new Date().getDay() || 7); 
      const dayPlan = mealPlan.find(d => d.day === dayOffset);
      const meal = dayPlan?.meals?.find((m: any) => m.slot.toLowerCase() === slot);

      if (meal) {
        await notificationService.sendPushNotification(
          plan.user.id,
          `${icon} Time for ${label}`,
          `${meal.name} is scheduled for you.`,
          { type: 'MEAL_REMINDER', mealSlot: slot }
        );
      }
    }
  });
});

// Supplement Reminders
cron.schedule('0 9,21 * * *', async () => {
  console.log('Running supplement reminder job...');
  const activePlans = await prisma.generatedPlan.findMany({
    where: { isActive: true },
    include: { user: { select: { id: true, fcmToken: true } } },
  });

  for (const plan of activePlans) {
    if (!plan.user.fcmToken) continue;
    
    const supplements = plan.supplementStack as any[];
    if (supplements.length > 0) {
      await notificationService.sendPushNotification(
        plan.user.id,
        "💊 Supplement Reminder",
        "Don't forget to take your scheduled supplements.",
        { type: 'SUPPLEMENT_REMINDER' }
      );
    }
  }
});
