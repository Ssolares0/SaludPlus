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
      error: 'Error al registrar el paciente'
    });
  }
};


export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const files = req.file;

    if (!files) throw new Error('Foto de perfil requerida');

    const result = await authService.registerDoctor(req.body, files);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al registar un doctor'
    });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al iniciar sesión'
    });
  }
}

export const approverUser = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const result = await authService.approvedUser(Number(req.params.id));
    res.status(200).json(result);
  }
  catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al aprobar el usuario'
    });
  }

};

export const approverAdmin = async (req: Request, res: Response) => {
  try {
    const authService = new AuthService();
    const token = req.headers.authorization as string;
    console.log(token);
    const files = req.file as Express.Multer.File;
    const result = await authService.approvedAdmin(token, files);
    res.status(200).json(result);
  }
  catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al aprobar el usuario'
    });
  }
};



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