"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/services/auth.service.test.ts
const Postgres_1 = require("../../src/config/database/Postgres");
const auth_service_1 = require("../../src/services/auth.service");
const bycript_1 = require("../../src/utils/bycript");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Mocks globales
jest.mock('../../src/config/database/Postgres');
jest.mock('../../src/utils/bycript');
jest.mock('jsonwebtoken');
const mockUser = {
    id: 1,
    email: 'admin@example.com',
    password: 'hashed_password',
    approved: true,
    role: { name: 'administrador' },
    person: { id: 1 }
};
describe('AuthService - login', () => {
    let authService;
    beforeEach(() => {
        authService = new auth_service_1.AuthService();
        Postgres_1.AppDataSource.manager.findOne.mockReset();
        bycript_1.comparePassword.mockReset();
        jsonwebtoken_1.default.sign.mockReturnValue('fake_token');
    });
    // --------------------------------------------
    // Caso 3: Usuario no aprobado (no admin)
    // --------------------------------------------
    it('debe retornar "Usuario no aprobado" para usuarios no administradores', async () => {
        const unapprovedUser = { ...mockUser, approved: false, role: { name: 'médico' } };
        Postgres_1.AppDataSource.manager.findOne.mockResolvedValue(unapprovedUser);
        bycript_1.comparePassword.mockResolvedValue(true);
        const result = await authService.login({
            email: 'doctor@example.com',
            password: 'correctpass'
        });
        expect(result).toEqual({
            success: false,
            message: "Usuario no aprobado"
        });
    });
});
