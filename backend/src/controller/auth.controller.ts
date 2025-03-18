import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export const registerPatient = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const result = await authService.registerPatient(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al registrar el paciente'
    });
  }
};