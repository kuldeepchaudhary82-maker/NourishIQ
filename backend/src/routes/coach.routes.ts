import { Router } from 'express';
import * as coachController from '../controllers/coach.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/chat', coachController.chatWithCoach);
router.get('/conversations', coachController.getConversations);

export default router;
