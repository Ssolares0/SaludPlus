import { Between, Not } from "typeorm";
import { AppDataSource } from "../config/database/Postgres";
import { Appointment } from "../models/Appointments.entity";
import { DoctorSchedule } from "../models/DoctorSchedule.entity";
import { Employee } from "../models/Employe.entity";
import { sendCancellationEmail } from "../utils/email";
import { error } from "console";
import { User } from "../models/User.entity";

export class EmployeService{
    async pendientAppointment(userId: number){
        //crear coneccion 
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{

            const appointement = await queryRunner.manager.find(
                Appointment, {
                    where:{
                        doctor:{id:userId},
                        status:"scheduled"
                    },
                    relations: ["patient","patient.person"],
                    order: {appointment_date: "ASC"}
                });

            await queryRunner.commitTransaction();

            return appointement;
        } catch (error: any){
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async completeAppointment(doctor_id: number, treatment: string, appointement_id: number){
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            if (!treatment?.trim()) throw new Error('El tratamiento es obligatorio para terminar la cita');

            const appointement = await queryRunner.manager.findOne(Appointment, {
                where: {
                    id: appointement_id,
                    doctor: {
                        id: doctor_id
                    }
                }
            });

            if (!appointement) throw new Error('Cita no encontrada');
            if (appointement.status !== "scheduled") throw new Error("La cita no esta programada");

            appointement.status = "completed";
            appointement.treatment = treatment;
            await queryRunner.manager.save(appointement);

            await queryRunner.commitTransaction();

            return {
                message: "Cita marcada como atendida"
            }


        }catch (error: any){
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async cancelAppointment(doctor_id: number, reason: string, appointement_id: number, messageApology:string){
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            if(!reason?.trim) throw new Error('La razon de cancelacion es obligatoria');

            const appointement = await queryRunner.manager.findOne(Appointment, {
                where:{
                    id: appointement_id,
                    doctor: {
                        id:doctor_id
                    }
                },
                relations: ["patient","patient.person","doctor","doctor.person"],
            })

            if(!appointement) throw new Error('Cita no encontrada');
            if(appointement.status !== "scheduled") throw new Error('La cita no esta programada');

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
            await sendCancellationEmail(
                appointement.patient.person.email,
                appointement.appointment_date,
                reason,
                `${appointement.doctor.person.first_name} ${appointement.doctor.person.last_name}`,
                messageApology
            );
            
            await queryRunner.commitTransaction();

            return{
                message:"Cita cancelada y notificada exitosamente"
            }

        }catch (error: any){
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async doctorScheduled(
        schedule: {
            days:number[];
            startTime: string;
            endTime:string;
        },
        doctor_id: number
    ){
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            if(!schedule.days?.length || !schedule.startTime || !schedule.endTime)throw new Error ('Datos incompletos');
            if (schedule.days.some(day => day < 1 || day > 7)) throw new Error('Dias invalidos (1-7)');
            console.log(schedule.startTime)
            if(schedule.startTime >= schedule.endTime) throw new Error('La hora de iniciao debe ser anterior a la hora de fin');

            const doctor = await queryRunner.manager.findOne(Employee, {
                where: {
                    id:doctor_id
                }
            })
            if (!doctor) throw new Error('No se encontro el doctor');

            await queryRunner.manager.delete(DoctorSchedule, {
                doctor:{
                    id:doctor_id
                }
            })

            for (const day of schedule.days){
                const scheduleDoctor = new DoctorSchedule();
                scheduleDoctor.day_of_week = day;
                scheduleDoctor.start_time = schedule.startTime;
                scheduleDoctor.end_time = schedule.endTime;
                scheduleDoctor.doctor = doctor;
                await queryRunner.manager.save(scheduleDoctor);
            }

            await queryRunner.commitTransaction()
            return {
                message:"Horaios actualizados"
            }
            
        }catch (error: any){
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getDoctorAppointmentHistory(
        doctor_id: number,
        status: string,
        startDate: Date,
        endDate: Date
    ){
        console.log(endDate);
        const where: any = {
            doctor: {id: doctor_id},
            status: Not('scheduled')
        }

        if(status) where.status = status;
        if(startDate && endDate){
            where.appointment_date = Between(startDate, endDate );
        }        

        console.log(where.appointment_date)
        try{
            const appointmentRepository = AppDataSource.getRepository(Appointment);
            const apoint = await appointmentRepository.find({
                where,
                relations: ['patient.person'],
                order: {appointment_date: "DESC"},
            });
    
            return apoint;
        } catch(error: any){
            console.log(error)
            throw error
        }
       
    }

    async GetDoctor(docto_id: number){
        try{

        
            const doctorRepository = AppDataSource.getRepository(User);
            const dataDoctor = await doctorRepository.findOne({
                where:{
                    id: docto_id
                },
                relations: ['person'],
            }) 

            if(dataDoctor){
                const response ={
                    id: dataDoctor.id,
                    firstName: dataDoctor.person.first_name,
                    lastName: dataDoctor.person.last_name,
                    birht_date: dataDoctor.person.birth_date,
                    gender: dataDoctor.person.gender,
                    phone: dataDoctor.person.phone,
                    photo: dataDoctor.person.photo,
                    addres: dataDoctor.person.address
                }
                return response
            }

            return {
                message:"No se encontro al doctor"
            }
            
        } catch {
            console.log(error);
            throw error;
        }
    }
}