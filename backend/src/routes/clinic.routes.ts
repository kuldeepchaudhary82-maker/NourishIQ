import { Router } from 'express';
import * as clinicController from '../controllers/clinic.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/invite', authMiddleware, adminMiddleware, clinicController.generateClinicInviteLink);
router.post('/register-patient', clinicController.registerClinicPatient);

export default router;
