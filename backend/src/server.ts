import app from './app';
import prisma from './utils/prisma';
import './jobs/reminders.job';

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });

    await prisma.$connect();
    console.log('Connected to Database');
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    // Don't exit here, let the app run and retry connections
  }
}

main();
