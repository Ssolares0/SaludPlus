import { application, Router } from 'express';
import { getPendientAppointment, putCompleteAppointment, cancelAppointment, updateScheduled, appointmentHistory, getDataDoctor} from '../controller/employee.controller';

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
export {router as employeeRouter}