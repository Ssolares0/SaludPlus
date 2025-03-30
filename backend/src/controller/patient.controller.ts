import { Request, Response } from 'express';


import { AppDataSource } from '../config/database/Postgres';
import { Employee } from '../models/Employe.entity';
import { Appointment } from '../models/Appointments.entity';
import { parse } from 'dotenv';
import { DoctorSchedule } from '../models/DoctorSchedule.entity';
import { generateTimeSlots, getDayName } from '../helpers/slotsPacient';
import { Patient } from '../models/Patient.entity';



export const doctorsAvailables = async (req: Request, res: Response) => {
    try {

        const id = Number(req.params.id);

        const appointments = await AppDataSource.getRepository(Appointment).find({
            where: {
                patient: { id: id },
            },
            relations: ['doctor'],
        });


        const bookedDoctorIds = appointments.map(app => app.doctor.id);

        console.log("aqui ando")


        const doctors = await AppDataSource.manager
            .createQueryBuilder(Employee, 'employee')
            .leftJoinAndSelect('employee.person', 'person')
            .leftJoinAndSelect('employee.specialty', 'employeeSpecialty')
            .leftJoinAndSelect('employeeSpecialty.specialty', 'specialty')
            .leftJoinAndSelect('employee.department', 'employeeDepartment')
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
            error: false,
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
            error: false,
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
            error: true,
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
        error: true,
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
    try {
        const { date, motive, doctorId, hour } = req.body;
        const { id } = req.params;

        if (!date || !motive || !doctorId || !hour) {
            res.status(400).json({
                error: false,
                message: 'La fecha, motivo y doctor son requeridos'
            });
            return
        }

        // Parse date components
        const [dateStr] = date.split(' ');
        const [year, month, day] = dateStr.split('-').map(Number);
        const [hours, minutes] = hour.split(':').map(Number);

        // Create date with timezone adjustment
        const selectedDate = new Date(year, month - 1, day, hours, minutes);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
        const dayOfWeek = selectedDate.getDay();

        // Get doctor's schedule
        const doctorSchedule = await AppDataSource.manager
            .createQueryBuilder(DoctorSchedule, 'schedule')
            .leftJoinAndSelect('schedule.doctor', 'doctor')
            .where('doctor.id = :doctorId', { doctorId })
            .getMany();

        if (doctorSchedule.length === 0) {
            res.status(404).json({
                error: false,
                message: 'No se encontró el horario del doctor'
            });
            return
        }

        // Check if doctor works on this day
        const daySchedule = doctorSchedule.find(schedule => schedule.day_of_week === dayOfWeek);
        if (!daySchedule) {
            res.status(400).json({
                error: false,
                message: 'El doctor no atiende este día'
            });
            return
        }

        // Check for existing appointments
        const existingAppointment = await AppDataSource.manager
            .createQueryBuilder(Appointment, 'appointment')
            .where('appointment.employee_id = :doctorId', { doctorId })
            .andWhere('appointment.appointment_date = :date', {
                date: selectedDate.toISOString()
            })
            .getOne();

        if (existingAppointment) {
            res.status(400).json({
                error: false,
                message: 'El horario seleccionado ya está ocupado'
            });
            return
        }

        // Get doctor and patient with their relationships
        const doctor = await AppDataSource.manager.findOneOrFail(Employee, {
            where: { id: doctorId },
            relations: ['person']
        });

        const patient = await AppDataSource.manager.findOneOrFail(Patient, {
            where: { id: parseInt(id) },
            relations: ['person']
        });

        // Create new appointment using repository
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        const appointment = appointmentRepository.create({
            appointment_date: selectedDate,
            reason: motive,
            status: 'scheduled',
            patient: patient,
            doctor: doctor
        });

        // Save using repository
        const savedAppointment = await appointmentRepository.save(appointment);

        res.status(201).json({
            error: true,
            message: 'Cita creada exitosamente',
            data: {
                id: savedAppointment.id,
                fecha: savedAppointment.appointment_date,
                motivo: savedAppointment.reason,
                estado: savedAppointment.status,
                doctor: {
                    id: doctor.id,
                    nombre: doctor.person.first_name,
                    apellido: doctor.person.last_name
                },
                paciente: {
                    id: patient.id,
                    nombre: patient.person.first_name,
                    apellido: patient.person.last_name
                }
            }
        });
        return

    } catch (error: any) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            message: 'Error al crear la cita',
            error: error.message
        });
        return
    }

}

export const activesDating = async (req: Request, res: Response) => {

    try {
        const { id } = req.params;

        if(!id){
            res.status(400).json({
                error: false,
                message: 'El ID del paciente es requerido'
            });
            return
        }

        const appointment = await AppDataSource.manager
            .createQueryBuilder(Appointment, 'appointment')
            .select([
                'appointment.id as appointment_id',
                'appointment.appointment_date as appointment_date',
                'appointment.reason as reason',
                'appointment.status as status',
                'doctor.id as doctor_id',
                'doctorPerson.first_name as doctorPerson_first_name',
                'doctorPerson.last_name as doctorPerson_last_name',
                'patient.id as patient_id',
                'patientPerson.first_name as patientPerson_first_name',
                'patientPerson.last_name as patientPerson_last_name'
            ])
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('doctor.person', 'doctorPerson')
            .leftJoinAndSelect('patient.person', 'patientPerson')
            .where('appointment.patient_id = :id', { id })
            .andWhere('appointment.status = :status', { status: 'scheduled' })
            .getRawMany();

        if (appointment.length === 0) {
            res.status(404).json({
                error: false,
                message: 'Cita no encontrada'
            });
            return
        }

        const appointmentData = appointment.map(app => ({
            id: app.appointment_id,
            fecha: app.appointment_date,
            motivo: app.reason,
            estado: app.status,
            doctor: {
                id: app.doctor_id,
                nombre: app.doctorPerson_first_name,
                apellido: app.doctorPerson_last_name
            },
            paciente: {
                id: app.patient_id,
                nombre: app.patientPerson_first_name,
                apellido: app.patientPerson_last_name
            }
        }))
        console.log(appointmentData)

        res.status(200).json({
            error: false,
            data: appointmentData
        });
        return



    } catch (error: any) {
        res.status(400).json({
            error: error.message
        });
    }
}

