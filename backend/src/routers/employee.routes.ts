import { application, Router } from 'express';
import { getPendientAppointment, putCompleteAppointment, cancelAppointment} from '../controller/employee.controller';

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
export {router as employeeRouter}