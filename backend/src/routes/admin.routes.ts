import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

import * as contentController from '../controllers/content.controller';

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users/update-tier', adminController.updateSubscriptionTier);
router.post('/broadcast', adminController.broadcastNotification);
router.get('/audit-logs', adminController.getAuditLogs);

// Content Management
router.post('/content/tips', contentController.createHealthTip);
router.post('/content/articles', contentController.createArticle);
router.put('/content/:id', contentController.updateContent);
router.delete('/content/:id', contentController.deleteContent);
router.post('/food-database', contentController.addFoodItem);
router.put('/food-database/:id', contentController.updateFoodItem);
router.delete('/food-database/:id', contentController.deleteFoodItem);

export default router;
