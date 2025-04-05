"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const typeorm_1 = require("typeorm");
const Postgres_1 = require("../config/database/Postgres");
const User_entity_1 = require("../models/User.entity");
const Employe_entity_1 = require("../models/Employe.entity");
class AdminService {
    async pendientPatient() {
        try {
            const patientRepository = Postgres_1.AppDataSource.getRepository(User_entity_1.User);
            const patients = await patientRepository.find({
                where: {
                    role: {
                        id: 3,
                    },
                    approved: (0, typeorm_1.IsNull)(),
                },
                relations: ['person'],
            });
            if (patients) {
                let respu = [];
                for (const per of patients) {
                    respu.push({
                        id: per.id,
                        firstame: per.person.first_name,
                        lastName: per.person.last_name,
                        birht_date: per.person.birth_date,
                        gender: per.person.gender,
                        phone: per.person.phone,
                        photo: per.person.photo,
                        addres: per.person.address
                    });
                }
                return respu;
            }
            return { message: "No hay pacientes pendientes" };
        }
        catch (error) {
            throw error;
        }
    }
    async pendientDoctor() {
        try {
            const doctorPatient = Postgres_1.AppDataSource.getRepository(User_entity_1.User);
            const doctors = await doctorPatient.find({
                where: {
                    role: {
                        id: 2,
                    },
                    approved: (0, typeorm_1.IsNull)(),
                },
                relations: ['person', 'person.employee', 'person.employee.specialty.specialty', 'person.employee.department.department'],
            });
            if (doctors) {
                let respu = [];
                for (const per of doctors) {
                    respu.push({
                        id: per.id,
                        firstame: per.person.first_name,
                        lastName: per.person.last_name,
                        dpi: per.person.national_id,
                        birht_date: per.person.birth_date,
                        gender: per.person.gender,
                        phone: per.person.phone,
                        photo: per.person.photo,
                        addres: per.person.address,
                        number_col: per.person.employee.employee_number,
                        specialty: per.person.employee.specialty,
                        department: per.person.employee.department
                    });
                }
                return respu;
            }
            return { message: "No hay doctores pendientes" };
        }
        catch (error) {
            throw error;
        }
    }
    async activePatients() {
        try {
            const patientRepository = Postgres_1.AppDataSource.getRepository(User_entity_1.User);
            const patients = await patientRepository.find({
                where: {
                    role: {
                        id: 3,
                    },
                    approved: true,
                },
                relations: ['person'],
            });
            if (patients) {
                let respu = [];
                for (const per of patients) {
                    respu.push({
                        id: per.id,
                        firstame: per.person.first_name,
                        lastName: per.person.last_name,
                        birht_date: per.person.birth_date,
                        gender: per.person.gender,
                        phone: per.person.phone,
                        photo: per.person.photo,
                        addres: per.person.address
                    });
                }
                return respu;
            }
            return { message: "No hay pacientes activos" };
        }
        catch (error) {
            throw error;
        }
    }
    async activeDoctors() {
        try {
            const doctorPatient = Postgres_1.AppDataSource.getRepository(User_entity_1.User);
            const doctors = await doctorPatient.find({
                where: {
                    role: {
                        id: 2,
                    },
                    approved: true,
                },
                relations: ['person', 'person.employee', 'person.employee.specialty.specialty', 'person.employee.department.department'],
            });
            if (doctors) {
                let respu = [];
                for (const per of doctors) {
                    respu.push({
                        id: per.id,
                        firstame: per.person.first_name,
                        lastName: per.person.last_name,
                        dpi: per.person.national_id,
                        birht_date: per.person.birth_date,
                        gender: per.person.gender,
                        phone: per.person.phone,
                        photo: per.person.photo,
                        addres: per.person.address,
                        number_col: per.person.employee.employee_number,
                        specialty: per.person.employee.specialty,
                        department: per.person.employee.department
                    });
                }
                return respu;
            }
            return { message: "No hay doctores activos" };
        }
        catch (error) {
            throw error;
        }
    }
    async deleteUser(userId) {
        const user = await Postgres_1.AppDataSource.manager.findOne(User_entity_1.User, {
            where: { id: userId },
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        user.approved = false;
        await Postgres_1.AppDataSource.manager.save(user);
        return { message: "Usuario dado de baja correctamente", success: true };
    }
    async topDoctors(specialty) {
        try {
            const query = Postgres_1.AppDataSource.createQueryBuilder(Employe_entity_1.Employee, "doctor")
                .select([
                "doctor.id AS id",
                "person.first_name AS firstName",
                "person.last_name AS lastName",
                "person.photo AS photo",
                "specialty.name AS specialty",
                "COUNT(DISTINCT appointment.patient_id) AS patientsCount",
                "COUNT(appointment.id) AS appointmentsCount"
            ])
                .innerJoin("doctor.person", "person")
                .innerJoin("person.user", "user", "user.approved = :approved", { approved: true })
                .leftJoin("doctor.specialty", "employee_specialty")
                .leftJoin("employee_specialty.specialty", "specialty")
                .leftJoin("doctor.appointments", "appointment", "appointment.status = :status", {
                status: "completed",
            })
                .groupBy("doctor.id, person.first_name, person.last_name, person.photo, specialty.name")
                .orderBy("patientsCount", "DESC")
                .addOrderBy("doctor.id", "ASC")
                .limit(Number(10));
            if (specialty) {
                query.andWhere("specialty.name ILIKE :specialty", { specialty: `%${specialty}%` });
            }
            const result = await query.getRawMany();
            const topDoctors = result.map((doctor) => ({
                id: doctor.id,
                name: `${doctor.firstname} ${doctor.lastname}`,
                photo: doctor.photo,
                specialty: doctor.specialty || "Sin especialidad registrada",
                patientsCount: parseInt(doctor.patientscount) || 0,
                appointmentsCount: parseInt(doctor.appointmentscount) || 0
            }));
            return topDoctors;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.AdminService = AdminService;
