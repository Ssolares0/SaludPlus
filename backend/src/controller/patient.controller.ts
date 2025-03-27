import { Request, Response } from 'express';


import { AppDataSource } from '../config/database/Postgres';
import { Employee } from '../models/Employe.entity';
import { Appointment } from '../models/Appointments.entity';
import { parse } from 'dotenv';
import { DoctorSchedule } from '../models/DoctorSchedule.entity';
import { generateTimeSlots, getDayName } from '../helpers/slotsPacient';



export const doctorsAvailables = async (req: Request, res: Response) => {
    try {

        //const files = req.file;
        const id = Number(req.params.id);

        // Obtener los médicos con los que el paciente ya tiene citas
        const appointments = await AppDataSource.getRepository(Appointment).find({
            where: {
                patient: { id: id },
            },
            relations: ['doctor'],
        });


        const bookedDoctorIds = appointments.map(app => app.doctor.id);

        console.log("aqui ando")

        // Obtener médicos excluyendo los ya agendados
        const doctors = await AppDataSource.manager
            .createQueryBuilder(Employee, 'employee')
            .leftJoinAndSelect('employee.person', 'person')
            .leftJoinAndSelect('employee.specialty', 'employeeSpecialty')  // matches entity property name
            .leftJoinAndSelect('employeeSpecialty.specialty', 'specialty')
            .leftJoinAndSelect('employee.department', 'employeeDepartment') // matches entity property name
            .leftJoinAndSelect('employeeDepartment.department', 'department')
            .where(qb => {
                if (bookedDoctorIds.length > 0) {
                    qb.where('employee.id NOT IN (:...bookedDoctorIds)', { bookedDoctorIds });
                }
            })
            .getMany();

        console.log("aqui ando x2")
        if (doctors.length === 0) {
            res.status(400).send('No hay doctores disponibles');
            return
        }
        // Formatear la respuesta
        const availableDoctors = doctors.map(doctor => ({
            id: doctor.id,
            nombre: doctor.person.first_name,
            apellido: doctor.person.last_name,
            especialidad: doctor.specialty.map(es => es.specialty.name),
            locacion: doctor.department.map(ed => ed.department.name)
        }));



        res.status(200).send(availableDoctors);
        return

    } catch (error: any) {
        res.status(400).json({
            error: error.message || 'Error al registrar el paciente'
        });
    }
};

export const findMedic = async (req: Request, res: Response) => {
    try {
        const { speciality } = req.body;

        if (!speciality) {
            res.status(400).send({ data: 'La especialidad es requerida', error: true });
            return
        }
        const doctors = await AppDataSource.manager
            .createQueryBuilder(Employee, 'employee')
            .leftJoinAndSelect('employee.person', 'person')
            .leftJoinAndSelect('employee.specialty', 'employeeSpecialty')  // matches entity property name
            .leftJoinAndSelect('employeeSpecialty.specialty', 'specialty')
            .leftJoinAndSelect('employee.department', 'employeeDepartment') // matches entity property name
            .leftJoinAndSelect('employeeDepartment.department', 'department')
            .where('specialty.name = :speciality', { speciality: speciality })
            .getMany();

        if (doctors.length === 0) {
            res.status(400).send({ data: 'No hay doctores disponibles con esa especialidad', error: true });
            return
        }

        // Formatear la respuesta
        const dataReturn = doctors.map(doctor => ({
            id: doctor.id,
            nombre: doctor.person.first_name,
            apellido: doctor.person.last_name,
            especialidad: doctor.specialty.map(es => es.specialty.name),
            locacion: doctor.department.map(ed => ed.department.name)
        }));


        res.status(200).send(dataReturn);
        return


    } catch (error: any) {
        res.status(400).json({
            error: error.message || 'Error al buscar un paciente por especialidad'
        });
    }
};

export const scheduleMedic = async (req: Request, res: Response) => {

    const { doctorId, date } = req.body;
    if (!doctorId || !date) {
        res.status(400).json({
            success: false,
            message: 'El ID del doctor y la fecha son requeridos'
        });
        return
    }
    const doctorSchedule = await AppDataSource.manager
        .createQueryBuilder(DoctorSchedule, 'schedule')
        .leftJoinAndSelect('schedule.doctor', 'doctor')
        .where('doctor.id = :doctorId', { doctorId })
        .getMany();

    if (doctorSchedule.length === 0) {
        res.status(404).json({
            success: false,
            message: 'No se encontró el horario del doctor'
        });
        return
    }

    const selectedDate = new Date(date);
    const appointments = await AppDataSource.manager
        .createQueryBuilder(Appointment, 'appointment')
        .where('appointment.employee_id = :doctorId', { doctorId })
        .andWhere('DATE(appointment.appointment_date) = DATE(:date)', { date: selectedDate })
        .getMany();

    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const daySchedule = doctorSchedule.find(schedule => schedule.day_of_week === dayOfWeek);


    if (!daySchedule) {
        res.status(200).json({
            success: true,
            message: 'El doctor no atiende este día',
            available: false,
            schedule: null
        });
        return
    }
    const timeSlots = generateTimeSlots(
        daySchedule.start_time,
        daySchedule.end_time,
        60,
        selectedDate

    );

    const availability = timeSlots.map(slot => ({
        time: slot.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
        isAvailable: !appointments.some(app =>
            app.appointment_date.getHours() === slot.getHours() &&
            app.appointment_date.getMinutes() === slot.getMinutes()
        )
    }));;

    res.status(200).json({
        success: true,
        data: {
            doctorSchedule: {
                start_time: daySchedule.start_time,
                end_time: daySchedule.end_time,
                day: getDayName(daySchedule.day_of_week)
            },
            availability,
            date: selectedDate
        }
    })
    return

};

export const createAppointment = async (req: Request, res: Response) => {
    const {date,motive,doctorId} = req.body;
    const {patientId} = req.params;
    
}


