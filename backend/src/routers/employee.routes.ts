import { application, Router } from 'express';
import { getPendientAppointment, putCompleteAppointment, cancelAppointment, updateScheduled, appointmentHistory} from '../controller/employee.controller';

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
export {router as employeeRouter}