import { getDayName } from '../../src/helpers/slotsPacient';

describe('getDayName', () => {
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