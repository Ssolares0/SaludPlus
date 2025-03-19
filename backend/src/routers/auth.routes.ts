import { Router } from 'express';
import { registerPatient, registerDoctor } from '../controller/auth.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {fileSize: 5*1024*1024}
});

const router = Router();

router.post(
    '/register/patient',
    upload.single('photo'),
    registerPatient
);
router.post(
    '/register/doctor',
    upload.single('photo'),
    registerDoctor
);

export { router as authRouter };