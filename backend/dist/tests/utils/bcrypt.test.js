"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bycript_1 = require("../../src/utils/bycript");
describe('AuthService - Password Handling', () => {
    it('debe encriptar y comparar contraseñas correctamente', async () => {
        const password = 'SecurePass123';
        // Encriptar
        const hashed = await (0, bycript_1.hashPassword)(password);
        // Comparar
        const isValid = await (0, bycript_1.comparePassword)(password, hashed);
        expect(isValid).toBe(true);
    });
});
