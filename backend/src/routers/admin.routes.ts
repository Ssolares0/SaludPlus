import { Router } from "express";
import { getPatientPending, getDoctorPending, getActivePatient, getActiveDoctor, deleteUser, getTopDoctors, getReportAgaintsDoctor, deleteReport } from "../controller/admin.controller";

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

router.delete(
    '/delete/user',
    deleteUser
)

router.get(
    '/report/topDoctor',
    getTopDoctors
)

router.get(
    '/report/againts/doctor',
    getReportAgaintsDoctor
)

router.delete(
    '/report/delete/:id',
    deleteReport
)
export {router as adminRouter}