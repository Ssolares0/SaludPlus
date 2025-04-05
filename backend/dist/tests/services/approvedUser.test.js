"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/services/user.service.test.ts
const Postgres_1 = require("../../src/config/database/Postgres");
const auth_service_1 = require("../../src/services/auth.service");
// Mock de TypeORM
jest.mock('../../src/config/database/Postgres', () => ({
    AppDataSource: {
        manager: {
            findOne: jest.fn(),
            save: jest.fn(),
        },
    },
}));
describe('UserService - approvedUser', () => {
    let userService;
    beforeEach(() => {
        userService = new auth_service_1.AuthService();
        jest.clearAllMocks(); // Limpiar mocks entre pruebas
    });
    // ----------------------------
    // Caso 1: Usuario no encontrado
    // ----------------------------
    it('debe lanzar error si el usuario no existe', async () => {
        // Mockear findOne para simular usuario no encontrado
        Postgres_1.AppDataSource.manager.findOne.mockResolvedValue(null);
        await expect(userService.approvedUser(999)).rejects.toThrow('Usuario no encontrado');
        // Verificar que NO se llamó a save
        expect(Postgres_1.AppDataSource.manager.save).not.toHaveBeenCalled();
    });
    // ----------------------------
    // Caso 2: Usuario aprobado exitosamente
    // ----------------------------
    it('debe aprobar al usuario y retornar mensaje de éxito', async () => {
        // Mockear usuario existente
        const mockUser = {
            id: 1,
            approved: false,
            person: { id: 1 },
            role: { id: 2 },
        };
        // Configurar mocks
        Postgres_1.AppDataSource.manager.findOne.mockResolvedValue(mockUser);
        Postgres_1.AppDataSource.manager.save.mockResolvedValue({
            ...mockUser,
            approved: true,
        });
        const result = await userService.approvedUser(1);
        // Verificar que se actualizó approved a true
        expect(Postgres_1.AppDataSource.manager.save).toHaveBeenCalledWith({
            ...mockUser,
            approved: true,
        });
        // Verificar respuesta
        expect(result).toEqual({
            message: "Usuario validado correctamente",
            success: true,
        });
    });
});
