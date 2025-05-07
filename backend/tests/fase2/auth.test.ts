// tests/services/auth.service.test.ts
import { AppDataSource } from '../../src/config/database/Postgres';
import { AuthService } from '../../src/services/auth.service';
import { User } from '../../src/models/User.entity';
import { comparePassword } from '../../src/utils/bycript';
import jwt from 'jsonwebtoken';

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
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    (AppDataSource.manager.findOne as jest.Mock).mockReset();
    (comparePassword as jest.Mock).mockReset();
    (jwt.sign as jest.Mock).mockReturnValue('fake_token');
  });

  // --------------------------------------------
  // Caso: Usuario no aprobado (no admin)
  // --------------------------------------------
  it('debe retornar "Usuario no aprobado" para usuarios no administradores', async () => {
    const unapprovedUser = { ...mockUser, approved: false, role: { name: 'médico' } };
    (AppDataSource.manager.findOne as jest.Mock).mockResolvedValue(unapprovedUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);

    const result = await authService.login({ 
      email: 'doctor@example.com', 
      password: 'correctpass'
    });

    expect(result).toEqual({
      requireAuthEmail: true,
      message: "Usurio sin email verificado y sin aprovacion",
      token:"fake_token"
    });
  });
});