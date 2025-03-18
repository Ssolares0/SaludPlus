import { AppDataSource } from '../config/database/Postgres';
import { Person } from '../models/Person.entity';
import { User } from '../models/User.entity';
import { Patient } from '../models/Patient.entity';
import { Role } from '../models/Role.entity';
import { hashPassword } from '../utils/bycript';

export class AuthService {
  async registerPatient(patientData: {
    firstName: string;
    lastName: string;
    dpi: string;
    email: string;
    password: string;
    birth_date: Date;
    gender: string;
    phone: string;
    address: string;
    role_id: number;

    
  }) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Crear Persona
      const person = new Person();
      person.first_name = patientData.firstName;
      person.last_name = patientData.lastName;
      person.national_id = patientData.dpi;
      person.email = patientData.email;
      await queryRunner.manager.save(person);

      // 2. Crear Usuario (con contraseña encriptada)
      const user = new User();
      user.email = patientData.email;
      user.password = await hashPassword(patientData.password);
      const role = await AppDataSource.manager.findOne(Role, {where: {id: patientData.role_id}});
      if (!role){
        throw new Error('Rol no encontrado');
      }
      user.role = role;
      user.person = person;
      await queryRunner.manager.save(user);

      // 3. Crear Paciente
      const patient = new Patient();
      patient.person = person;
      await queryRunner.manager.save(patient);

      await queryRunner.commitTransaction();
      return { success: true, userId: user.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}