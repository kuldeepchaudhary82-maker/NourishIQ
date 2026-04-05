import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/generate', planController.generatePlan);
router.get('/current', planController.getCurrentPlan);
router.get('/history', planController.getPlanHistory);

export default router;
