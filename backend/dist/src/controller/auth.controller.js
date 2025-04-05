"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = exports.approverAdmin = exports.approverUser = exports.login = exports.registerDoctor = exports.registerPatient = void 0;
const auth_service_1 = require("../services/auth.service");
const registerPatient = async (req, res) => {
    try {
        const authService = new auth_service_1.AuthService();
        const files = req.file;
        const result = await authService.registerPatient(req.body, files);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: 'Error al registrar el paciente'
        });
    }
};
exports.registerPatient = registerPatient;
const registerDoctor = async (req, res) => {
    try {
        const authService = new auth_service_1.AuthService();
        const files = req.file;
        if (!files)
            throw new Error('Foto de perfil requerida');
        const result = await authService.registerDoctor(req.body, files);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al registar un doctor'
        });
    }
};
exports.registerDoctor = registerDoctor;
const login = async (req, res) => {
    try {
        const authService = new auth_service_1.AuthService();
        const result = await authService.login(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al iniciar sesión'
        });
    }
};
exports.login = login;
const approverUser = async (req, res) => {
    try {
        const authService = new auth_service_1.AuthService();
        const result = await authService.approvedUser(Number(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al aprobar el usuario'
        });
    }
};
exports.approverUser = approverUser;
const approverAdmin = async (req, res) => {
    try {
        const authService = new auth_service_1.AuthService();
        const token = req.headers.authorization;
        console.log(token);
        const files = req.file;
        const result = await authService.approvedAdmin(token, files);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al aprobar el usuario'
        });
    }
};
exports.approverAdmin = approverAdmin;
const registerAdmin = async (req, res) => {
    try {
        const authService = new auth_service_1.AuthService();
        const files = req.file;
        const result = await authService.registerAdmin(req.body, files);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error.message || 'Error al registrar el administrador'
        });
    }
};
exports.registerAdmin = registerAdmin;
