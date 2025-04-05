"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post('/register/patient', upload.single('photo'), auth_controller_1.registerPatient);
router.post('/register/doctor', upload.single('photo'), auth_controller_1.registerDoctor);
router.post('/register/admin', upload.single('photo'), auth_controller_1.registerAdmin);
router.post('/login', auth_controller_1.login);
router.post('/admin/auth2', upload.single('archivo'), auth_controller_1.approverAdmin);
router.put('/admin/approved/:id', auth_controller_1.approverUser);
