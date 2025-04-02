import { getDayName } from '../../src/helpers/slotsPacient';

describe('getDayName', () => {
  // -----------------------------------------------------------
  // Casos válidos (números del 0 al 6)
  // -----------------------------------------------------------
  it('debe retornar "Domingo" para el día 0', () => {
    expect(getDayName(0)).toBe('Domingo');
  });
  
  // -----------------------------------------------------------
  // Casos inválidos (fuera de rango)
  // -----------------------------------------------------------
  it('debe retornar undefined para números fuera de rango', () => {
    // Día negativo
    expect(getDayName(-1)).toBeUndefined();
    // Día mayor a 6
    expect(getDayName(7)).toBeUndefined();
  });
});