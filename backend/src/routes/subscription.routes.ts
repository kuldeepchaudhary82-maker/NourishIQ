import { Router } from 'express';
import * as subscriptionController from '../controllers/subscription.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/create', authMiddleware, subscriptionController.createSubscription);
router.get('/current', authMiddleware, subscriptionController.getSubscriptionStatus);
router.post('/webhook', subscriptionController.verifyWebhook);

export default router;
