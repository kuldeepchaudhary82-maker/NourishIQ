import { Router } from 'express';
import * as logController from '../controllers/log.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/meal', logController.logMeal);
router.post('/supplement', logController.logSupplement);
router.post('/activity', logController.logActivity);
router.post('/activity/sync', logController.syncActivity);
router.post('/water', logController.logWater);
router.get('/summary/:date', logController.getDaySummary);

export default router;
