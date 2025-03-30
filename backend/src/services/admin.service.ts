import { IsNull } from "typeorm";
import { AppDataSource } from "../config/database/Postgres"
import { User } from "../models/User.entity";


export class AdminService{
    async pendientPatient() {
        try{
            const patientRepository = AppDataSource.getRepository(User);

            const patients = await patientRepository.find({
                where:{
                    role:{
                        id:3,
                    },
                    approved:IsNull(),
                },
                relations:['person'],
            })

            if(patients){
                let respu:any[] = [];
                for(const per of patients){
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

            return {message: "No hay pacientes pendientes"};
        }catch(error: any){
            throw error
        }
    }

    async pendientDoctor(){
        try{
            const doctorPatient = AppDataSource.getRepository(User);

            const doctors = await doctorPatient.find({
                where:{
                    role:{
                        id:2,
                    },
                    approved:IsNull(),
                },
                relations:['person'],
            })

            if(doctors){
                let respu:any[] = [];
                for(const per of doctors){
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

            return {message: "No hay pacientes pendientes"};
        }catch(error: any){
            throw error
        }
    }

    async activePatients(){
        try{
            const patientRepository = AppDataSource.getRepository(User);

            const patients = await patientRepository.find({
                where:{
                    role:{
                        id:3,
                    },
                    approved:true,
                },
                relations:['person'],
            })

            if(patients){
                let respu:any[] = [];
                for(const per of patients){
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

            return {message: "No hay pacientes activos"};
        }catch(error: any){
            throw error
        }
    }
}