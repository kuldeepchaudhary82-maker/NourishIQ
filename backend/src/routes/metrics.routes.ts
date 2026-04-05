import { Router } from 'express';
import * as metricsController from '../controllers/metrics.controller';
import * as ocrController from '../controllers/ocr.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/progress/summary', metricsController.getProgressSummary);
router.get('/charts/weight', metricsController.getWeightTrend);
router.get('/charts/body-fat', metricsController.getBodyFatTrend);
router.get('/lab-results', metricsController.getLabResults);

// OCR Lab Reports
router.post('/lab-results/ocr', upload.single('report'), ocrController.uploadAndProcessLabReport);
router.post('/lab-results/confirm', ocrController.confirmLabResults);

export default router;
