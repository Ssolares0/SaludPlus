import { application, Router } from 'express';
import { registerPatient, registerDoctor,login, approverUser, approverAdmin, registerAdmin} from '../controller/auth.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
    fileFilter: (req, file, cb) => {
      // Validar tipos de archivo
      if (file.fieldname === 'photo') {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('La foto debe ser una imagen'));
        }
      } else if (file.fieldname === 'pdf') {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('El CV debe ser un PDF'));
        }
      }
      cb(null, true);
    },
});

const router = Router();

router.post(
    '/register/patient',
    upload.fields([
        {name: 'photo', maxCount: 1},
        {name: 'pdf', maxCount:1}
    ]),
    registerPatient
);
router.post(
    '/register/doctor',
    upload.fields([
        {name: 'photo', maxCount: 1},
        {name: 'pdf', maxCount:1}
    ]),
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