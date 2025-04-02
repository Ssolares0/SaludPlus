// tests/services/auth.test.ts
import { AuthService } from '../../src/services/auth.service';
import { hashPassword, comparePassword } from '../../src/utils/bycript';

describe('AuthService - Password Handling', () => {
  it('debe encriptar y comparar contraseñas correctamente', async () => {
    const password = 'SecurePass123';
    
    // Encriptar
    const hashed = await hashPassword(password);
    
    // Comparar
    const isValid = await comparePassword(password, hashed);
    
    expect(isValid).toBe(true);
  });
});