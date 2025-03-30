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

            return patients;
        }catch(error: any){
            throw error
        }
    }
}