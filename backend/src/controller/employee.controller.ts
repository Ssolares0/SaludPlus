import { Request, Response } from 'express';
import { EmployeService } from '../services/employee.service';


export const getPendientAppointment = async (req: Request, res: Response) => {
  try {
    const employeService = new EmployeService();
    const result = await employeService.pendientAppointment(Number(req.params.id));
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al registrar el paciente'
    });
  }
};

export const putCompleteAppointment = async(req: Request, res: Response) => {
    try {
        const employeService = new EmployeService();
        const {doctor_id, treatment} = req.body;
        const {id} = req.params;
        const result = await employeService.completeAppointment(doctor_id, treatment, Number(id));
        res.status(201).json(result);
    } catch (error: any){
        res.status(400).json({
            error: error.message || 'Error al registrar el paciente'
          });
    }
}

export const cancelAppointment = async(req:Request, res: Response) => {
    try{
        const employeService = new EmployeService();
        const {doctor_id, reason, apology} = req.body;
        const {id} = req.params;
        const result = await employeService.cancelAppointment(doctor_id, reason, Number(id), apology);
        res.status(201).json(result);
    }catch(error: any){
        res.status(400).json({
            error: error.message || 'Error al registrar el paciente'
          });
    }
}