import { AppDataSource } from "../config/database/Postgres";
import { Appointment } from "../models/Appointments.entity";
import { sendCancellationEmail } from "../utils/email";

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
}