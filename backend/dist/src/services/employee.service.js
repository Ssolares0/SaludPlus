"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeService = void 0;
const typeorm_1 = require("typeorm");
const Postgres_1 = require("../config/database/Postgres");
const Appointments_entity_1 = require("../models/Appointments.entity");
const DoctorSchedule_entity_1 = require("../models/DoctorSchedule.entity");
const Employe_entity_1 = require("../models/Employe.entity");
const email_1 = require("../utils/email");
const console_1 = require("console");
const User_entity_1 = require("../models/User.entity");
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const Person_entity_1 = require("../models/Person.entity");
class EmployeService {
    async pendientAppointment(userId) {
        //crear coneccion 
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const appointement = await queryRunner.manager.find(Appointments_entity_1.Appointment, {
                where: {
                    doctor: { id: userId },
                    status: "scheduled"
                },
                relations: ["patient", "patient.person"],
                order: { appointment_date: "ASC" }
            });
            await queryRunner.commitTransaction();
            return appointement;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async completeAppointment(doctor_id, treatment, appointement_id) {
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!(treatment === null || treatment === void 0 ? void 0 : treatment.trim()))
                throw new Error('El tratamiento es obligatorio para terminar la cita');
            const appointement = await queryRunner.manager.findOne(Appointments_entity_1.Appointment, {
                where: {
                    id: appointement_id,
                    doctor: {
                        id: doctor_id
                    }
                }
            });
            if (!appointement)
                throw new Error('Cita no encontrada');
            if (appointement.status !== "scheduled")
                throw new Error("La cita no esta programada");
            appointement.status = "completed";
            appointement.treatment = treatment;
            await queryRunner.manager.save(appointement);
            await queryRunner.commitTransaction();
            return {
                message: "Cita marcada como atendida"
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancelAppointment(doctor_id, reason, appointement_id, messageApology) {
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!(reason === null || reason === void 0 ? void 0 : reason.trim))
                throw new Error('La razon de cancelacion es obligatoria');
            const appointement = await queryRunner.manager.findOne(Appointments_entity_1.Appointment, {
                where: {
                    id: appointement_id,
                    doctor: {
                        id: doctor_id
                    }
                },
                relations: ["patient", "patient.person", "doctor", "doctor.person"],
            });
            if (!appointement)
                throw new Error('Cita no encontrada');
            if (appointement.status !== "scheduled")
                throw new Error('La cita no esta programada');
            appointement.status = "canceled";
            appointement.cancellation_reason = reason;
            await queryRunner.manager.save(appointement);
            //envia el correo 
            if (!appointement.patient || !appointement.patient.person || !appointement.patient.person.email) {
                throw new Error('El paciente o su correo electrónico no están disponibles para enviar la notificación');
            }
            if (!appointement.doctor || !appointement.doctor.person || !appointement.patient.person.first_name) {
                throw new Error('El paciente o su correo electrónico no están disponibles para enviar la notificación');
            }
            await (0, email_1.sendCancellationEmail)(appointement.patient.person.email, appointement.appointment_date, reason, `${appointement.doctor.person.first_name} ${appointement.doctor.person.last_name}`, messageApology);
            await queryRunner.commitTransaction();
            return {
                message: "Cita cancelada y notificada exitosamente"
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getScheduledDoctor(doctor_id) {
        const employeeRepositoru = Postgres_1.AppDataSource.getRepository(DoctorSchedule_entity_1.DoctorSchedule);
        const scheduled = await employeeRepositoru.find({
            where: {
                doctor: {
                    id: doctor_id
                },
            },
        });
        if (!scheduled)
            return [];
        return scheduled;
    }
    async doctorScheduled(schedule, doctor_id) {
        var _a;
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!((_a = schedule.days) === null || _a === void 0 ? void 0 : _a.length) || !schedule.startTime || !schedule.endTime)
                throw new Error('Datos incompletos');
            if (schedule.days.some(day => day < 1 || day > 7))
                throw new Error('Dias invalidos (1-7)');
            console.log(schedule.startTime);
            if (schedule.startTime >= schedule.endTime)
                throw new Error('La hora de iniciao debe ser anterior a la hora de fin');
            const doctor = await queryRunner.manager.findOne(Employe_entity_1.Employee, {
                where: {
                    id: doctor_id
                }
            });
            if (!doctor)
                throw new Error('No se encontro el doctor');
            await queryRunner.manager.delete(DoctorSchedule_entity_1.DoctorSchedule, {
                doctor: {
                    id: doctor_id
                }
            });
            for (const day of schedule.days) {
                const scheduleDoctor = new DoctorSchedule_entity_1.DoctorSchedule();
                scheduleDoctor.day_of_week = day;
                scheduleDoctor.start_time = schedule.startTime;
                scheduleDoctor.end_time = schedule.endTime;
                scheduleDoctor.doctor = doctor;
                await queryRunner.manager.save(scheduleDoctor);
            }
            await queryRunner.commitTransaction();
            return {
                message: "Horaios actualizados"
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async getDoctorAppointmentHistory(doctor_id, status, startDate, endDate) {
        console.log(endDate);
        const where = {
            doctor: { id: doctor_id },
            status: (0, typeorm_1.Not)('scheduled')
        };
        if (status)
            where.status = status;
        if (startDate && endDate) {
            where.appointment_date = (0, typeorm_1.Between)(startDate, endDate);
        }
        console.log(where.appointment_date);
        try {
            const appointmentRepository = Postgres_1.AppDataSource.getRepository(Appointments_entity_1.Appointment);
            const apoint = await appointmentRepository.find({
                where,
                relations: ['patient.person'],
                order: { appointment_date: "DESC" },
            });
            return apoint;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async GetDoctor(docto_id) {
        try {
            const doctorRepository = Postgres_1.AppDataSource.getRepository(User_entity_1.User);
            const dataDoctor = await doctorRepository.findOne({
                where: {
                    id: docto_id
                },
                relations: ['person'],
            });
            if (dataDoctor) {
                const response = {
                    id: dataDoctor.id,
                    firstName: dataDoctor.person.first_name,
                    lastName: dataDoctor.person.last_name,
                    birht_date: dataDoctor.person.birth_date,
                    gender: dataDoctor.person.gender,
                    phone: dataDoctor.person.phone,
                    photo: dataDoctor.person.photo,
                    addres: dataDoctor.person.address
                };
                return response;
            }
            return {
                message: "No se encontro al doctor"
            };
        }
        catch (_a) {
            console.log(console_1.error);
            throw console_1.error;
        }
    }
    async updateDoctor(doctor_id, dataDoctor, file) {
        const queryRunner = await Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const doctorRes = await queryRunner.manager.findOne(User_entity_1.User, {
                where: { id: doctor_id },
                relations: ['person'],
            });
            if (!doctorRes)
                throw new Error("Medico no encontrado");
            //actualizar data
            doctorRes.person.first_name = dataDoctor.first_name;
            doctorRes.person.last_name = dataDoctor.last_name;
            doctorRes.person.birth_date = dataDoctor.birth_date;
            doctorRes.person.gender = dataDoctor.gender;
            doctorRes.person.phone = dataDoctor.phone;
            doctorRes.person.address = dataDoctor.address;
            if (file) {
                const filename = `${(0, uuid_1.v4)()}_${file.originalname}`;
                const s3Client = new client_s3_1.S3Client({
                    region: process.env.AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    },
                });
                await s3Client.send(new client_s3_1.PutObjectCommand({
                    Bucket: process.env.S3_BUCKET,
                    Key: `fotos/${filename}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                }));
                const photoUrl = `http://${process.env.S3_BUCKET}.s3.amazonaws.com/fotos/${filename}`;
                doctorRes.person.photo = photoUrl;
            }
            doctorRes.name = `${dataDoctor.first_name} ${dataDoctor.last_name}`;
            await queryRunner.manager.save(Person_entity_1.Person, doctorRes.person);
            await queryRunner.manager.save(User_entity_1.User, doctorRes);
            await queryRunner.commitTransaction();
            return { message: "Actualizacion Completa" };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
}
exports.EmployeService = EmployeService;
