import { Router } from 'express';
import * as onboardingController from '../controllers/onboarding.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/health-profile', onboardingController.saveHealthProfile);
router.post('/body-composition', onboardingController.saveBodyComposition);
router.post('/lab-results', onboardingController.saveLabResults);
router.post('/dietary-preferences', onboardingController.saveDietaryPreferences);
router.post('/lifestyle', onboardingController.saveLifestyle);
router.post('/complete', onboardingController.completeOnboarding);

export default router;
