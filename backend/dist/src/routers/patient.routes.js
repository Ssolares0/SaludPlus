"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRouter = void 0;
const express_1 = require("express");
const patient_controller_1 = require("../controller/patient.controller");
const router = (0, express_1.Router)();
exports.patientRouter = router;
router.get('/doctors/:id', patient_controller_1.doctorsAvailables);
router.get('/appointments/:id', patient_controller_1.getAllPatientAppointments);
router.post('/doctors-speciality', patient_controller_1.findMedic);
router.post('/schedule', patient_controller_1.scheduleMedic);
router.post('/appointment/:id', patient_controller_1.createAppointment);
router.get('/appointment-actives/:id', patient_controller_1.activesAppointment);
router.delete('/cancel-appointment/:id', patient_controller_1.cancelAppointment);
router.get('/profile/:id', patient_controller_1.getAndUpdateProfile); // Obtener perfil
router.put('/profile/:id', patient_controller_1.getAndUpdateProfile);
