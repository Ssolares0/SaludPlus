"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopDoctors = exports.deleteUser = exports.getActiveDoctor = exports.getActivePatient = exports.getDoctorPending = exports.getPatientPending = void 0;
const admin_service_1 = require("../services/admin.service");
const getPatientPending = async (req, res) => {
    try {
        const adminService = new admin_service_1.AdminService();
        const result = await adminService.pendientPatient();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al obtener los pacientes'
        });
    }
};
exports.getPatientPending = getPatientPending;
const getDoctorPending = async (req, res) => {
    try {
        const adminService = new admin_service_1.AdminService();
        const result = await adminService.pendientDoctor();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al obtener los doctores'
        });
    }
};
exports.getDoctorPending = getDoctorPending;
const getActivePatient = async (_, res) => {
    try {
        const adminService = new admin_service_1.AdminService();
        const result = await adminService.activePatients();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al obtener los pacientes'
        });
    }
};
exports.getActivePatient = getActivePatient;
const getActiveDoctor = async (req, res) => {
    try {
        const adminService = new admin_service_1.AdminService();
        const result = await adminService.activeDoctors();
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al obtener los doctores'
        });
    }
};
exports.getActiveDoctor = getActiveDoctor;
const deleteUser = async (req, res) => {
    try {
        const adminService = new admin_service_1.AdminService();
        const result = await adminService.deleteUser(Number(req.body.id));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al dar de baja al usuario'
        });
    }
};
exports.deleteUser = deleteUser;
const getTopDoctors = async (req, res) => {
    try {
        const adminService = new admin_service_1.AdminService();
        const result = await adminService.topDoctors(req.body.specialty);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al generar reporte top doctores'
        });
    }
};
exports.getTopDoctors = getTopDoctors;
