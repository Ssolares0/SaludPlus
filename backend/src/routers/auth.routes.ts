import { Router } from 'express';
import { registerPatient } from '../controller/auth.controller';

const router = Router();

router.post('/register/patient', registerPatient);

export { router as authRouter };