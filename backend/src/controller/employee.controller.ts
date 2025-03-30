import { Request, Response } from 'express';
import { EmployeService } from '../services/employee.service';


export const getPendientAppointment = async (req: Request, res: Response) => {
  try {
    const employeService = new EmployeService();
    const result = await employeService.pendientAppointment(Number(req.params.id));
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Error al traer citas pendientes'
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
            error: error.message || 'Error al completar cita'
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
            error: error.message || 'Error al cancelar cita'
          });
    }
}

export const updateScheduled = async(req: Request, res: Response) => {
  try{
    const employeeService = new EmployeService();
    const result = await employeeService.doctorScheduled(req.body, Number(req.params.id));
    res.status(201).json(result);
  }catch(error: any){
    res.status(400).json({
      error: error.message || 'Error al registrar horarios'
    })
  }
}

export const appointmentHistory = async(req: Request, res: Response) => {
  try{
    const employeService = new EmployeService();
    const result = await employeService.getDoctorAppointmentHistory(Number(req.params.id), req.body.status, req.body.startDate, req.body.endDate)
    res.status(201).json(result);
  }catch(error: any){
    res.status(400).json({
      error: error.message || 'Error al registrar horarios'
    })
  }
}

export const getDataDoctor = async(req: Request, res: Response) => {
  try{
    const employeService = new EmployeService();
    const result = await employeService.GetDoctor(Number(req.params.id))
    res.status(201).json(result);
  }catch(error: any){
    res.status(400).json({
      error: error.message || 'Error al buscar al doctor'
    })
  }
}

export const updateDoctor = async(req: Request, res: Response) => {
  try{
    const employeService = new EmployeService();
    const result = await employeService.updateDoctor(Number(req.params.id), req.body, req.file);
    res.status(201).json(result);
  }catch(error: any){
    res.status(400).json({
      error: error.message || 'Error al actualizar la informacion de doctor'
    })
  }
}