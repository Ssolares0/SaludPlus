import { application, Router } from 'express';
import { activesDating, createAppointment, doctorsAvailables,findMedic, scheduleMedic} from '../controller/patient.controller';
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

router.post(
    '/appointment/:id',
    createAppointment
)

router.get(
    '/appointment-actives/:id',
    activesDating
)
 

export { router as patientRouter };