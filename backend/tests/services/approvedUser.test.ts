// tests/services/user.service.test.ts
import { AppDataSource } from '../../src/config/database/Postgres';
import { AuthService } from '../../src/services/auth.service';
import { User } from '../../src/models/User.entity';

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
  let userService: AuthService;

  beforeEach(() => {
    userService = new AuthService();
    jest.clearAllMocks(); // Limpiar mocks entre pruebas
  });

  // ----------------------------
  // Caso 1: Usuario no encontrado
  // ----------------------------
  it('debe lanzar error si el usuario no existe', async () => {
    // Mockear findOne para simular usuario no encontrado
    (AppDataSource.manager.findOne as jest.Mock).mockResolvedValue(null);

    await expect(userService.approvedUser(999)).rejects.toThrow(
      'Usuario no encontrado'
    );

    // Verificar que NO se llamó a save
    expect(AppDataSource.manager.save).not.toHaveBeenCalled();
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
    (AppDataSource.manager.findOne as jest.Mock).mockResolvedValue(mockUser);
    (AppDataSource.manager.save as jest.Mock).mockResolvedValue({
      ...mockUser,
      approved: true,
    });

    const result = await userService.approvedUser(1);

    // Verificar que se actualizó approved a true
    expect(AppDataSource.manager.save).toHaveBeenCalledWith({
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