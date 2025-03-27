import { application, Router } from 'express';
import { doctorsAvailables,findMedic, scheduleMedic} from '../controller/patient.controller';
import multer from 'multer';

const router = Router();

router.get(
    '/doctors/:id',
    doctorsAvailables
);

router.post(
    '/doctors-speciality',
    findMedic
)

router.post(
    '/schedule',
    scheduleMedic
)
 

export { router as patientRouter };