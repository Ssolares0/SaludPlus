import { Request, Response } from 'express';


import { AppDataSource } from '../config/database/Postgres';
import { Employee } from '../models/Employe.entity';



export const doctorsAvailables = async (req: Request, res: Response) => {
    try {

        const files = req.file;
        const { uuid } = req.params;

        /* const appointmentRepository = AppDataSource.getRepository(Appointment);
        const employeeRepository = AppDataSource.getRepository(Employee);

        // Obtener los médicos con los que el paciente ya tiene citas
        const appointments = await appointmentRepository.find({
            relations: ['doctor'],
            where: {
                patient: {
                    id: uuid,
                },
            },
        });

        const bookedDoctorIds = appointments.map(app => app.id) */;

        /* // Obtener médicos excluyendo los ya agendados
        const doctors = await employeeRepository.find({
            relations: ['person', 'specialties', 'departments'],
            where: {
                id: Not(In(bookedDoctorIds)),
            },
        });

        // Formatear la respuesta
        const availableDoctors = doctors.map(doctor => ({
            fullName: `${doctor.person.first_name} ${doctor.person.last_name}`,
            specialty: doctor.specialty.map(s => s.name).join(', '),
            clinicAddress: doctor.department.map(d => d.location).join(', '),
            photoUrl: doctor.person.photo,
        })); */


        /* res.json(availableDoctors); */
        return




    } catch (error: any) {
        res.status(400).json({
            error: error.message || 'Error al registrar el paciente'
        });
    }
};

export const findMedic = async (req: Request, res: Response) => {
    try{
        const speciality = req.body;


    }catch(error:any){
        res.status(400).json({
            error: error.message || 'Error al buscar un paciente por especialidad'
        });
    }
};

