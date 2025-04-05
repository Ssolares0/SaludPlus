import { IsNull } from "typeorm";
import { AppDataSource } from "../config/database/Postgres"
import { User } from "../models/User.entity";
import { Appointment } from "../models/Appointments.entity";
import { Employee } from "../models/Employe.entity";


export class AdminService {
    async pendientPatient() {
        try {
            const patientRepository = AppDataSource.getRepository(User);

            const patients = await patientRepository.find({
                where: {
                    role: {
                        id: 3,
                    },
                    approved: IsNull(),
                },
                relations: ['person'],
            })

            if (patients) {
                let respu: any[] = [];
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
                    })
                }
                return respu
            }

            return { message: "No hay pacientes pendientes" };
        } catch (error: any) {
            throw error
        }
    }

    async pendientDoctor() {
        try {
            const doctorPatient = AppDataSource.getRepository(User);

            const doctors = await doctorPatient.find({
                where: {
                    role: {
                        id: 2,
                    },
                    approved: IsNull(),
                },
                relations: ['person', 'person.employee', 'person.employee.specialty.specialty', 'person.employee.department.department'],
            })

            if (doctors) {
                let respu: any[] = [];
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

                    })
                }
                return respu
            }

            return { message: "No hay doctores pendientes" };
        } catch (error: any) {
            throw error
        }
    }

    async activePatients() {
        try {
            const patientRepository = AppDataSource.getRepository(User);

            const patients = await patientRepository.find({
                where: {
                    role: {
                        id: 3,
                    },
                    approved: true,
                },
                relations: ['person'],
            })

            if (patients) {
                let respu: any[] = [];
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
                    })
                }
                return respu
            }

            return { message: "No hay pacientes activos" };
        } catch (error: any) {
            throw error
        }
    }

    async activeDoctors() {
        try {
            const doctorPatient = AppDataSource.getRepository(User);

            const doctors = await doctorPatient.find({
                where: {
                    role: {
                        id: 2,
                    },
                    approved: true,
                },
                relations: ['person', 'person.employee', 'person.employee.specialty.specialty', 'person.employee.department.department'],
            })

            if (doctors) {
                let respu: any[] = [];
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
                    })
                }
                return respu
            }

            return { message: "No hay doctores activos" };
        } catch (error: any) {
            throw error
        }
    }

    async deleteUser(userId: number) {
        const user = await AppDataSource.manager.findOne(User, {
            where: { id: userId },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        user.approved = false;
        await AppDataSource.manager.save(user);

        return { message: "Usuario dado de baja correctamente", success: true };
    }

    async topDoctors(specialty: string) {
        try {
            const query = AppDataSource.createQueryBuilder(Employee, "doctor")
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
    
        } catch (error: any) {
            throw error
        }
    }
}