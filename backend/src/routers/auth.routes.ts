import { application, Router } from 'express';
import { registerPatient, registerDoctor,login, approverUser, approverAdmin, registerAdmin} from '../controller/auth.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
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

router.post(
    '/login',
    login
);

router.post(
    '/admin/auth2',
    upload.single('archivo'),
    approverAdmin

)
router.put(
    '/admin/approved/:id',
    approverUser
);

export { router as authRouter };