"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDoctor = exports.getDataDoctor = exports.appointmentHistory = exports.updateScheduled = exports.getScheduled = exports.cancelAppointment = exports.putCompleteAppointment = exports.getPendientAppointment = void 0;
const employee_service_1 = require("../services/employee.service");
const getPendientAppointment = async (req, res) => {
    try {
        const employeService = new employee_service_1.EmployeService();
        const result = await employeService.pendientAppointment(Number(req.params.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al traer citas pendientes'
        });
    }
};
exports.getPendientAppointment = getPendientAppointment;
const putCompleteAppointment = async (req, res) => {
    try {
        const employeService = new employee_service_1.EmployeService();
        const { doctor_id, treatment } = req.body;
        const { id } = req.params;
        const result = await employeService.completeAppointment(doctor_id, treatment, Number(id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al completar cita'
        });
    }
};
exports.putCompleteAppointment = putCompleteAppointment;
const cancelAppointment = async (req, res) => {
    try {
        const employeService = new employee_service_1.EmployeService();
        const { doctor_id, reason, apology } = req.body;
        const { id } = req.params;
        const result = await employeService.cancelAppointment(doctor_id, reason, Number(id), apology);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al cancelar cita'
        });
    }
};
exports.cancelAppointment = cancelAppointment;
const getScheduled = async (req, res) => {
    try {
        const employeeService = new employee_service_1.EmployeService();
        const result = await employeeService.getScheduledDoctor(Number(req.params.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al obtener horarios'
        });
    }
};
exports.getScheduled = getScheduled;
const updateScheduled = async (req, res) => {
    try {
        const employeeService = new employee_service_1.EmployeService();
        const result = await employeeService.doctorScheduled(req.body, Number(req.params.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al registrar horarios'
        });
    }
};
exports.updateScheduled = updateScheduled;
const appointmentHistory = async (req, res) => {
    try {
        const employeService = new employee_service_1.EmployeService();
        const result = await employeService.getDoctorAppointmentHistory(Number(req.params.id), req.body.status, req.body.startDate, req.body.endDate);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al registrar horarios'
        });
    }
};
exports.appointmentHistory = appointmentHistory;
const getDataDoctor = async (req, res) => {
    try {
        const employeService = new employee_service_1.EmployeService();
        const result = await employeService.GetDoctor(Number(req.params.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al buscar al doctor'
        });
    }
};
exports.getDataDoctor = getDataDoctor;
const updateDoctor = async (req, res) => {
    try {
        const employeService = new employee_service_1.EmployeService();
        const result = await employeService.updateDoctor(Number(req.params.id), req.body, req.file);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al actualizar la informacion de doctor'
        });
    }
};
exports.updateDoctor = updateDoctor;
