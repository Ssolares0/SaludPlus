"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRouter = void 0;
const express_1 = require("express");
const employee_controller_1 = require("../controller/employee.controller");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
const router = (0, express_1.Router)();
exports.employeeRouter = router;
router.get('/pendiente/appointment/:id', employee_controller_1.getPendientAppointment);
router.put('/complete/appointment/:id', employee_controller_1.putCompleteAppointment);
router.delete('/cancel/appointment/:id', employee_controller_1.cancelAppointment);
router.get('/scheduled/:id', employee_controller_1.getScheduled);
router.post('/scheduled/:id', employee_controller_1.updateScheduled);
router.post('/history/appointments/:id', employee_controller_1.appointmentHistory);
router.get('/doctor/:id', employee_controller_1.getDataDoctor);
router.put('/update/doctor/:id', upload.single('photo'), employee_controller_1.updateDoctor);
