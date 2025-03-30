import { Router } from "express";
import { getPatientPending } from "../controller/admin.controller";

const router = Router();

router.get(
    '/pending/patients',
    getPatientPending
)

export {router as adminRouter}