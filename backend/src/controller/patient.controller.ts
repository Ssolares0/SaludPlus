import { Request, Response } from 'express';


import { AppDataSource } from '../config/database/Postgres';
import { Employee } from '../models/Employe.entity';
import { Appointment } from '../models/Appointments.entity';
import { parse } from 'dotenv';
import { DoctorSchedule } from '../models/DoctorSchedule.entity';
import { generateTimeSlots, getDayName } from '../helpers/slotsPacient';
import { Patient } from '../models/Patient.entity';
import { User } from '../models/User.entity';
import { EmployeeSpecialty } from '../models/EmployeeSpecialties.entity';




export const doctorsAvailables = async (req: Request, res: Response) => {
    try {
        // Consulta para obtener los doctores con role = 2 y approved = true
        const doctors = await AppDataSource.manager
            .createQueryBuilder(User, 'user')
            .leftJoinAndSelect('user.person', 'person')
            .leftJoinAndSelect('person.employee', 'employee')
            .leftJoinAndSelect('employee.specialty', 'employeeSpecialty')
            .leftJoinAndSelect('employeeSpecialty.specialty', 'specialty')
            .leftJoinAndSelect('employee.department', 'employeeDepartment')
            .leftJoinAndSelect('employeeDepartment.department', 'department')
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

        // Formatear la respuesta incluyendo especialidades y ubicaciones
        const formattedDoctors = doctors.map(doctor => {
            const especialidades = doctor.person?.employee?.specialty?.map(es => es.specialty?.name) || [];

            return {
                id: doctor.id,
                nombre: doctor.person.first_name,
                apellido: doctor.person.last_name,
                email: doctor.person.email,
                foto: doctor.person.photo,
                doctorId: doctor.person.employee.id,
                especialidad: especialidades
            };
        });

        res.status(200).json({
            error: false,
            data: formattedDoctors
        });
    } catch (error: any) {
        console.error("Error completo:", error);
        res.status(500).json({
            error: true,
            message: 'Error al obtener los doctores disponibles',
            details: error.message
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

    // Usamos UTC para evitar problemas con zonas horarias
    const selectedDate = new Date(date);

    // Para asegurarnos de obtener el día correcto
    const dayOfWeek = selectedDate.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.

    // Obtenemos todas las citas para ese día
    const appointments = await AppDataSource.manager
        .createQueryBuilder(Appointment, 'appointment')
        .where('appointment.employee_id = :doctorId', { doctorId })
        .andWhere('DATE(appointment.appointment_date) = DATE(:date)', { date: selectedDate })
        .andWhere('appointment.status = :status', { status: 'scheduled' }) // Solo considerar citas programadas, no canceladas
        .getMany();

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
        60, // Intervalo de 60 minutos
        selectedDate
    );

    // Función para verificar si un slot está disponible
    const isSlotAvailable = (slot: Date): boolean => {
        // Hora de inicio del slot a verificar
        const slotStartHour = slot.getHours();
        const slotStartMinute = slot.getMinutes();

        // Verificamos si hay alguna cita programada que se solape con este slot
        return !appointments.some(appointment => {
            const appointmentDate = new Date(appointment.appointment_date);
            const appointmentHour = appointmentDate.getHours();
            const appointmentMinute = appointmentDate.getMinutes();

            // Consideramos que cada cita ocupa 1 hora completa
            // Un slot está ocupado si coincide exactamente con la hora de inicio de una cita
            return appointmentHour === slotStartHour && appointmentMinute === slotStartMinute;
        });
    };

    const availability = timeSlots.map(slot => ({
        time: slot.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
        isAvailable: isSlotAvailable(slot)
    }));

    // Obtener el día de la semana en español
    const correctDay = getDayName(dayOfWeek);

    res.status(200).json({
        error: false,
        data: {
            doctorSchedule: {
                start_time: daySchedule.start_time,
                end_time: daySchedule.end_time,
                day: correctDay
            },
            availability,
            date: selectedDate
        }
    });
    return;
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

        console.log('Datos recibidos:', { date, hour, doctorId, motive });

        const [year, month, day] = date.split('-').map(Number);
        const [hours, minutes] = hour.split(':').map(Number);

        const appointmentDateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00.000Z`;

        console.log('Fecha a guardar:', appointmentDateString);

        const selectedDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));

        console.log('Fecha seleccionada (UTC):', selectedDate.toISOString());

        const dayOfWeek = selectedDate.getUTCDay();

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

        const daySchedule = doctorSchedule.find(schedule => schedule.day_of_week === dayOfWeek);
        if (!daySchedule) {
            res.status(400).json({
                error: true,
                message: 'El doctor no atiende este día'
            });
            return;
        }

        const existingAppointment = await AppDataSource.manager
            .createQueryBuilder(Appointment, 'appointment')
            .where('appointment.employee_id = :doctorId', { doctorId })
            .andWhere('appointment.status = :status', { status: 'scheduled' })
            .andWhere("TO_CHAR(appointment.appointment_date, 'YYYY-MM-DD') = :dateStr", {
                dateStr: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            })
            .andWhere("TO_CHAR(appointment.appointment_date, 'HH24:MI') = :timeStr", {
                timeStr: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            })
            .getOne();

        if (existingAppointment) {
            res.status(400).json({
                error: true,
                message: 'El horario seleccionado ya está ocupado'
            });
            return;
        }

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

        const result = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Appointment)
            .values({
                appointment_date: () => `TO_TIMESTAMP('${appointmentDateString}', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`,
                reason: motive,
                status: 'scheduled',
                patient: patient,
                doctor: doctor
            })
            .returning('*')
            .execute();

        const savedAppointment = result.raw[0];

        console.log('Cita guardada con fecha:', savedAppointment.appointment_date);

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

        if (!id) {
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
    try {
        const { id } = req.params;

        if (!id) {
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


        if (!appointment) {
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

    } catch (error: any) {
        res.status(400).json({
            error: error.message
        });
    }
};

export const getAllPatientAppointments = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                error: true,
                message: 'El ID del paciente es requerido'
            });
            return;
        }

        // Obtener todas las citas del paciente sin filtrar por estado
        const appointments = await AppDataSource.manager
            .createQueryBuilder(Appointment, 'appointment')
            .select([
                'appointment.id as appointment_id',
                'appointment.appointment_date as appointment_date',
                'appointment.reason as reason',
                'appointment.status as status',
                'appointment.treatment as treatment',
                'appointment.cancellation_reason as cancellation_reason',
                'doctor.id as doctor_id',
                'doctorPerson.first_name as doctorPerson_first_name',
                'doctorPerson.last_name as doctorPerson_last_name',
                'doctorPerson.photo as doctorPerson_photo',
                'patient.id as patient_id',
                'patientPerson.first_name as patientPerson_first_name',
                'patientPerson.last_name as patientPerson_last_name'
            ])
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('doctor.person', 'doctorPerson')
            .leftJoinAndSelect('patient.person', 'patientPerson')
            .where('appointment.patient_id = :id', { id })
            .orderBy('appointment.appointment_date', 'DESC') // Las más recientes primero
            .getRawMany();

        if (appointments.length === 0) {
            // No se encontraron citas, pero esto no es un error
            res.status(200).json({
                error: false,
                message: 'El paciente no tiene citas registradas',
                data: []
            });
            return;
        }

        // Formatear los datos para la respuesta
        const appointmentData = appointments.map(app => ({
            id: app.appointment_id,
            fecha: app.appointment_date,
            motivo: app.reason,
            estado: app.status,
            tratamiento: app.treatment,
            motivo_cancelacion: app.cancellation_reason,
            doctor: {
                id: app.doctor_id,
                nombre: app.doctorPerson_first_name,
                apellido: app.doctorPerson_last_name,
                foto: app.doctorPerson_photo
            },
            paciente: {
                id: app.patient_id,
                nombre: app.patientPerson_first_name,
                apellido: app.patientPerson_last_name
            }
        }));

        // Enviar la respuesta
        res.status(200).json({
            error: false,
            data: appointmentData
        });

    } catch (error: any) {
        console.error('Error al obtener las citas del paciente:', error);
        res.status(500).json({
            error: true,
            message: 'Error al obtener las citas del paciente',
            details: error.message
        });
    }
};

export const getAndUpdateProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // ID del paciente
        const { firstName, lastName, phone, address, birth_date, gender, photoUrl } = req.body;

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
        if (photoUrl) patient.person.photo = photoUrl

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


