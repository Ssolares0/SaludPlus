import { AdminService } from "../services/admin.service";
import { Request, Response } from "express";

export const getPatientPending = async(req: Request, res: Response) => {
    try{
        const adminService = new AdminService();
        const result = await  adminService.pendientPatient();
        res.status(201).json(result);
    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al obtener los pacientes'
        });
    }
}