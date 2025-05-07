// src/utils/__tests__/tokens.test.ts
import { generateEmailToken } from '../../src/utils/token';

describe('generateEmailToken', () => {
  // Verifica que el token tenga 6 dígitos y sea numérico
  it('debe retornar un string de 6 dígitos numéricos', () => {
    const token = generateEmailToken();
    
    // Longitud correcta
    expect(token).toHaveLength(6);
    
    //Todos los caracteres son digitos
    expect(token).toMatch(/^[0-9]+$/);
    
    //rango correcto (100000 a 999999)
    const numericToken = parseInt(token, 10);
    expect(numericToken).toBeGreaterThanOrEqual(100000);
    expect(numericToken).toBeLessThanOrEqual(999999);
  });

  // Verifica que los tokens generados sean diferentes (aleatorios)
  it('debe generar tokens diferentes en llamadas sucesivas', () => {
    const token1 = generateEmailToken();
    const token2 = generateEmailToken();
    
    expect(token1).not.toBe(token2);
  });
});