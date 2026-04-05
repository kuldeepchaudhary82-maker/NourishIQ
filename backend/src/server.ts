import app from './app';
import { PrismaClient } from '@prisma/client';
import './jobs/reminders.job';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to Database');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
