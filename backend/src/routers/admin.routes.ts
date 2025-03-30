import { Router } from "express";
import { getPatientPending, getDoctorPending, getActivePatient, getActiveDoctor } from "../controller/admin.controller";

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

router.get(
    '/active/doctors',
    getActiveDoctor
)
export {router as adminRouter}