import { application, Router } from 'express';
import { doctorsAvailables} from '../controller/patient.controller';
import multer from 'multer';

const router = Router();

router.get(
    '/patient/doctors',
    doctorsAvailables
);


export { router as patientRouter };