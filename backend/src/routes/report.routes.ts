import { Router } from 'express';
import * as reportController from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', reportController.getWeeklyReports);
router.get('/:id', reportController.getWeeklyReportById);

export default router;
