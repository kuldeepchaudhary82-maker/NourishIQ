import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/revenue', analyticsController.getRevenueStats);
router.get('/growth', analyticsController.getUserGrowthStats);
router.get('/usage', analyticsController.getFeatureUsageStats);
router.get('/subscriptions', analyticsController.getAllSubscriptions);

export default router;
