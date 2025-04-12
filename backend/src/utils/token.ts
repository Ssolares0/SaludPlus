// src/utils/tokens.ts
import crypto from 'crypto';

// Generar token de 6 dígitos (ej: 123456)
export const generateEmailToken = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};