import { application, Router } from 'express';
import { getPendientAppointment, putCompleteAppointment, cancelAppointment, updateScheduled, appointmentHistory, getDataDoctor, updateDoctor} from '../controller/employee.controller';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const router = Router();

router.get(
    '/pendiente/appointment/:id',
    getPendientAppointment
)

router.put(
    '/complete/appointment/:id',
    putCompleteAppointment
)

router.delete(
    '/cancel/appointment/:id',
    cancelAppointment
)

router.post(
    '/scheduled/:id',
    updateScheduled
)

router.post(
    '/history/appointments/:id',
    appointmentHistory
)

router.get(
    '/doctor/:id',
    getDataDoctor
)

router.put(
    '/update/doctor/:id',
    upload.single('photo'),
    updateDoctor
)
export {router as employeeRouter}