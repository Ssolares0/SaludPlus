import { Request, Response } from 'express';


import { AppDataSource } from '../config/database/Postgres';
import { Employee } from '../models/Employe.entity';
import { Appointment } from '../models/Appointments.entity';
import { parse } from 'dotenv';
import { DoctorSchedule } from '../models/DoctorSchedule.entity';
import { generateTimeSlots, getDayName } from '../helpers/slotsPacient';
import { Patient } from '../models/Patient.entity';
import { User } from '../models/User.entity';




export const doctorsAvailables = async (req: Request, res: Response) => {
    try {

        /* const id = Number(req.params.id);

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
 */
        // Consulta para obtener los doctores con role = 2 y approved = true
        const doctors = await AppDataSource.manager
            .createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.person', 'person') // Relación con la tabla 'person'
            .where('user.role = :role', { role: 2 })
            .andWhere('user.approved = :approved', { approved: true })
            .getMany();

        // Verificar si hay doctores disponibles
        if (doctors.length === 0) {
            res.status(404).json({
                error: true,
                message: 'No hay doctores disponibles'
            });
            return;
        }

        // Formatear la respuesta
        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.id,
            nombre: doctor.person.first_name,
            apellido: doctor.person.last_name,
            email: doctor.person.email
        }));

        res.status(200).json({
            error: false,
            data: formattedDoctors
        });
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

        // Validar datos requeridos
        if (!date || !motive || !doctorId || !hour) {
            res.status(400).json({
                error: true,
                message: 'La fecha, motivo, doctor y hora son requeridos'
            });
            return;
        }

        // Parsear y ajustar la fecha y hora
        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = hour.split(':').map(Number);
        const selectedDate = new Date(year, month - 1, day, hours, minutes);
        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
        const dayOfWeek = selectedDate.getDay();

        // Verificar el horario del doctor
        const doctorSchedule = await AppDataSource.manager
            .createQueryBuilder(DoctorSchedule, 'schedule')
            .leftJoinAndSelect('schedule.doctor', 'doctor')
            .where('doctor.id = :doctorId', { doctorId })
            .getMany();

        if (doctorSchedule.length === 0) {
            res.status(404).json({
                error: true,
                message: 'No se encontró el horario del doctor'
            });
            return;
        }

        // Verificar si el doctor trabaja ese día
        const daySchedule = doctorSchedule.find(schedule => schedule.day_of_week === dayOfWeek);
        if (!daySchedule) {
            res.status(400).json({
                error: true,
                message: 'El doctor no atiende este día'
            });
            return;
        }

        // Verificar si el horario está ocupado
        const existingAppointment = await AppDataSource.manager
            .createQueryBuilder(Appointment, 'appointment')
            .where('appointment.employee_id = :doctorId', { doctorId })
            .andWhere('appointment.appointment_date = :date', {
                date: selectedDate.toISOString()
            })
            .getOne();

        if (existingAppointment) {
            res.status(400).json({
                error: true,
                message: 'El horario seleccionado ya está ocupado'
            });
            return;
        }

        // Obtener doctor y paciente con sus relaciones
        const doctor = await AppDataSource.manager.findOne(Employee, {
            where: { id: doctorId },
            relations: ['person']
        });

        if (!doctor) {
            res.status(404).json({
                error: true,
                message: 'Doctor no encontrado'
            });
            return;
        }

        const patient = await AppDataSource.manager.findOne(Patient, {
            where: { id: parseInt(id) },
            relations: ['person']
        });

        if (!patient) {
            res.status(404).json({
                error: true,
                message: 'Paciente no encontrado'
            });
            return;
        }

        // Crear nueva cita
        const appointmentRepository = AppDataSource.getRepository(Appointment);
        const appointment = appointmentRepository.create({
            appointment_date: selectedDate,
            reason: motive,
            status: 'scheduled',
            patient: patient,
            doctor: doctor
        });

        // Guardar la cita
        const savedAppointment = await appointmentRepository.save(appointment);

        res.status(201).json({
            error: false,
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
    } catch (error: any) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({
            error: true,
            message: 'Error al crear la cita',
            details: error.message
        });
    }
};
export const activesAppointment = async (req: Request, res: Response) => {

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

export const cancelAppointment = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        if(!id){
            res.status(400).json({
                error: false,
                message: 'El ID del paciente y el ID de la cita son requeridos'
            });
            return
        }

        const appointment = await AppDataSource.manager
            .createQueryBuilder(Appointment, 'appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('doctor.person', 'doctorPerson')
            .leftJoinAndSelect('patient.person', 'patientPerson')
            .where('appointment.id = :id', { id })
            .andWhere('appointment.status = :status', { status: 'scheduled' })
            .getOne();


        if(!appointment){
            res.status(404).json({
                error: false,
                message: 'Cita no encontrada'
            });
            return
        }

        appointment.status = 'canceled';
        appointment.cancellation_reason = 'Cancelada por el paciente';
        await AppDataSource.manager.save(Appointment, appointment);

        res.status(200).json({
            error: false,
            message: 'Cita cancelada exitosamente',
            data: {
                id: appointment.id,
                fecha: appointment.appointment_date,
                motivo: appointment.reason,
                estado: appointment.status,
                doctor: {
                    id: appointment.doctor.id,
                    nombre: appointment.doctor.person.first_name,
                    apellido: appointment.doctor.person.last_name
                },
                paciente: {
                    id: appointment.patient.id,
                    nombre: appointment.patient.person.first_name,
                    apellido: appointment.patient.person.last_name
                }
            }

        })
        return

    }catch(error: any){
        res.status(400).json({
            error: error.message
        });
    }
};

export const getAndUpdateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // ID del paciente
        const { firstName, lastName, phone, address, birth_date, gender,photoUrl } = req.body;

        // Verificar si el ID del paciente es válido
        if (!id) {
            res.status(400).json({
                error: true,
                message: 'El ID del paciente es requerido'
            });
            return;
        }

        // Buscar al paciente con sus relaciones
        const patient = await AppDataSource.manager.findOne(Patient, {
            where: { id: parseInt(id) },
            relations: ['person']
        });

        if (!patient) {
            res.status(404).json({
                error: true,
                message: 'Paciente no encontrado'
            });
            return;
        }

        // Si no hay datos en el cuerpo de la solicitud, devolver el perfil
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(200).json({
                error: false,
                data: {
                    id: patient.id,
                    firstName: patient.person.first_name,
                    lastName: patient.person.last_name,
                    phone: patient.person.phone,
                    address: patient.person.address,
                    birth_date: patient.person.birth_date,
                    gender: patient.person.gender,
                    photoUrl: patient.person.photo
                }
            });
            return;
        }

        // Actualizar los datos del perfil (excepto el correo electrónico)
        if (firstName) patient.person.first_name = firstName;
        if (lastName) patient.person.last_name = lastName;
        if (phone) patient.person.phone = phone;
        if (address) patient.person.address = address;
        if (birth_date) patient.person.birth_date = new Date(birth_date);
        if (gender) patient.person.gender = gender;
        if(photoUrl) patient.person.photo = photoUrl

        // Guardar los cambios
        await AppDataSource.manager.save(patient.person);

        res.status(200).json({
            error: false,
            message: 'Perfil actualizado correctamente',
            data: {
                id: patient.id,
                firstName: patient.person.first_name,
                lastName: patient.person.last_name,
                phone: patient.person.phone,
                address: patient.person.address,
                birth_date: patient.person.birth_date,
                gender: patient.person.gender,
                email: patient.person.email // El correo no se puede modificar
            }
        });
    } catch (error: any) {
        res.status(500).json({
            error: true,
            message: 'Error al obtener o actualizar el perfil',
            details: error.message
        });
    }
};


