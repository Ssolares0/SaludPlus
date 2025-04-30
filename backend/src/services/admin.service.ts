import { IsNull } from "typeorm";
import { AppDataSource } from "../config/database/Postgres"
import { User } from "../models/User.entity";
import { Appointment } from "../models/Appointments.entity";
import { Employee } from "../models/Employe.entity";
import { Reports } from "../models/Reports.entity";


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

    async reportAgainstDoctor(){
        try{
            return await AppDataSource.getRepository(Reports)
            .createQueryBuilder('reports')
            //carga relaciones 
            .innerJoinAndSelect('reports.reporter', 'reporter')
            .innerJoinAndSelect('reports.reported', 'reported')
            .innerJoin('reporter.role', 'reporterRole')
            .innerJoin('reported.role', 'reportedRole')
            // Aplicar filtros
            .where('reporterRole.name = :reporterRole', { reporterRole: 'paciente' })
            // Ordenar
            .orderBy('reports.created_at', 'DESC')
            // Seleccionar campos específicos (opcional)
            .select([
                'reports.id',
                'reports.category',
                'reports.description',
                'reports.created_at',
                'reporter.id',
                'reporter.name',
                'reported.id',
                'reported.name',
                'reporterRole.name',
                'reportedRole.name'
            ])
            .getRawMany();
        } catch (error:any){
            throw error
        }
    }

    async reportDelete(id_report: number){
        try{
            await AppDataSource.manager.delete(Reports, id_report)
            return {
                message: "Reporte eliminado"
            }

        }catch(error:any){
            throw error
        }

    }

    async reportAgainstPatient(){
        try{
            return await AppDataSource.getRepository(Reports)
            .createQueryBuilder('reports')
            //carga relaciones 
            .innerJoinAndSelect('reports.reporter', 'reporter')
            .innerJoinAndSelect('reports.reported', 'reported')
            .innerJoin('reporter.role', 'reporterRole')
            .innerJoin('reported.role', 'reportedRole')
            // Aplicar filtros
            .where('reporterRole.name = :reporterRole', { reporterRole: 'doctor' })
            // Ordenar
            .orderBy('reports.created_at', 'DESC')
            // Seleccionar campos específicos (opcional)
            .select([
                'reports.id',
                'reports.category',
                'reports.description',
                'reports.created_at',
                'reporter.id',
                'reporter.name',
                'reported.id',
                'reported.name',
                'reporterRole.name',
                'reportedRole.name'
            ])
            .getRawMany();
        } catch (error:any){
            throw error
        }
    }
}


// select  u.name,  AVG(r.rating) as califa from users u
// inner join people p on u.person_id = p.id
// inner join patients pat on p.id = pat.person_id
// inner join appointments a on pat.id = a.patient_id and a.status = 'completed'
// inner join ratings r on a.id = r.appointment_id and r.rater_role = 'doctor'
// where u.role_id = 3 and u.approved = true and u.email_verification_token = true
// group by u.name