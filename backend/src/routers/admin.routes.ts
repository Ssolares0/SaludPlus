import { Router } from "express";
import { getPatientPending, getDoctorPending, getActivePatient } from "../controller/admin.controller";

const router = Router();

router.get(
    '/pending/patients',
    getPatientPending
)

router.get(
    '/pending/doctors',
    getDoctorPending
)

router.get(
    '/active/patients',
    getActivePatient
)
export {router as adminRouter}