"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Postgres_1 = require("./database/Postgres");
const auth_routes_1 = require("../routers/auth.routes");
const employee_routes_1 = require("../routers/employee.routes");
const patient_routes_1 = require("../routers/patient.routes");
const admin_routes_1 = require("../routers/admin.routes");
const PORT = 3001;
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
(0, Postgres_1.connectPg)();
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
exports.app.get('/version', (req, res) => {
    res.status(200).json({ version: '1.0.0' });
});
//Rutas
exports.app.use('/auth', auth_routes_1.authRouter);
exports.app.use('/employee', employee_routes_1.employeeRouter);
exports.app.use('/patient', patient_routes_1.patientRouter);
exports.app.use('/admin', admin_routes_1.adminRouter);
exports.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
