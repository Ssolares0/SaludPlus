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

export const getDoctorPending = async(req: Request, res: Response) => {
    try{
        const adminService = new AdminService();
        const result = await  adminService.pendientDoctor();
        res.status(201).json(result);
    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al obtener los doctores'
        });
    }
}

export const getActivePatient = async(_:Request, res:Response) => {
    try{
        const adminService = new AdminService();
        const result = await  adminService.activePatients();
        res.status(201).json(result);
    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al obtener los pacientes'
        });
    }
}

export const getActiveDoctor = async(req: Request, res: Response) => {
    try{
        const adminService = new AdminService();
        const result = await  adminService.activeDoctors();
        res.status(201).json(result);
    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al obtener los doctores'
        });
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    try{
        const adminService = new AdminService();
        const result = await  adminService.deleteUser(Number(req.body.id));
        res.status(201).json(result);
    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al dar de baja al usuario'
        });
    }
}

export const getTopDoctors = async(req: Request, res: Response) => {
    try{
        const adminService = new AdminService();

        const result = await  adminService.topDoctors(req.body.specialty);
        res.status(201).json(result);
    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al generar reporte top doctores'
        });
    }
}

export const getReportAgaintsDoctor = async(_: Request, res: Response) => {
    try{    
        const adminService = new AdminService();

        const result = await adminService.reportAgainstDoctor();
        res.status(201).json(result);

    } catch (error: any){
        res.status(400).json({
            error: error.message || 'Error al obtener los reportes contra medicos'
        })
    } 
}

export const deleteReport = async(req: Request, res: Response) => {
    try{    
        const adminService = new AdminService();

        const result = await adminService.reportDelete(Number(req.params.id));
        res.status(201).json(result);

    } catch (error: any){
        res.status(400).json({
            error: error.message || 'Error al eleminar el reporte contra medicos'
        })
    } 
}

export const getReportAgaintsPatient = async(_: Request, res: Response) => {
    try{    
        const adminService = new AdminService();

        const result = await adminService.reportAgainstPatient();
        res.status(201).json(result);

    } catch (error: any){
        res.status(400).json({
            error: error.message || 'Error al obtener los reportes contra medicos'
        })
    } 
}

