import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';


export const registerPatient = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const files = req.file;
    const result = await authService.registerPatient(req.body, files);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al registrar el paciente'
    });
  }
};


export const registerDoctor = async (req: Request, res: Response) => {
    try {
        const authService = new AuthService();
        const files = req.file;

        if(!files) throw new Error('Foto de perfil requerida');

        const result = await authService.registerDoctor(req.body, files);
        res.status(201).json(result);   
    } catch (error: any){
        res.status(400).json({
            error: error.message || 'Error al registar un doctor'
        });
    }
}

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const files = req.file;
    const result = await authService.registerAdmin(req.body, files);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al registrar el administrador'
    });
  }
};