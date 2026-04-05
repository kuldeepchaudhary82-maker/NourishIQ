import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/fcm-token', notificationController.registerFcmToken);
router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);

export default router;
