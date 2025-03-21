import { Router } from 'express';
import { registerPatient, registerDoctor, registerAdmin} from '../controller/auth.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage
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
router.post(
    '/register/admin',
    upload.single('photo'),
    registerAdmin
);

export { router as authRouter };