import { application, Router } from 'express';
import {
    activesAppointment, cancelAppointment, createAppointment,
    doctorsAvailables,
    findMedic, getAndUpdateProfile, scheduleMedic, getAllPatientAppointments, getMedications,
} from '../controller/patient.controller';
import multer from 'multer';

const router = Router();

router.get(
    '/doctors/:id',
    doctorsAvailables
);

router.get(
    '/appointments/:id',
    getAllPatientAppointments
)

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
    activesAppointment
)
router.delete(
    '/cancel-appointment/:id',
    cancelAppointment
)

router.get(
    '/profile/:id', getAndUpdateProfile
); // Obtener perfil

router.get(
    '/medicati/:id', 
    getMedications
);
router.put(
    '/profile/:id', getAndUpdateProfile
);

export { router as patientRouter };