import { AppDataSource } from '../config/database/Postgres';
import { Person } from '../models/Person.entity';
import { User } from '../models/User.entity';
import { Patient } from '../models/Patient.entity';
import { Role } from '../models/Role.entity';
import { comparePassword, hashPassword } from '../utils/bycript';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { configDotenv } from 'dotenv';
import { Employee } from '../models/Employe.entity';
import { Specialty } from '../models/Specialty.entity';
import { EmployeeSpecialty } from '../models/EmployeeSpecialties.entity';
import { Department } from '../models/Department';
import { EmployeeDepartmetn } from '../models/EmployeeDepartment.entity';
import { commonParams } from '@aws-sdk/client-s3/dist-types/endpoint/EndpointParameters';
import bcrypt from 'bcrypt';
import fs from 'fs';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'AYD12025';
configDotenv();

export class AuthService {
  async registerPatient(patientData: {
    firstName: string;
    lastName: string;
    dpi: string;
    email: string;
    password: string;
    birth_date: Date;
    gender: string; //1 hombre, 0 mujer
    phone: string;
    address: string;
    role_id: number;


  },
    file?: Express.Multer.File
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const person = new Person();
      // subi foto si tiene
      if (file) {
        const filename = `${uuidv4()}_${file.originalname}`;
        const s3Client = new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });

        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET!,
            Key: `fotos/${filename}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          })
        );

        const photoUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/fotos/${filename}`;
        person.photo = photoUrl;
      }
      // 1. Crear Persona

      person.first_name = patientData.firstName;
      person.last_name = patientData.lastName;
      person.national_id = patientData.dpi;
      person.email = patientData.email;
      person.birth_date = patientData.birth_date;
      person.gender = patientData.gender;
      person.phone = patientData.phone;
      person.address = patientData.address;
      await queryRunner.manager.save(person);

      // 2. Crear Usuario (con contraseña encriptada)
      const user = new User();
      user.name = patientData.firstName + patientData.lastName;
      user.email = patientData.email;
      user.password = await hashPassword(patientData.password);
      user.person = person;
      const role = await AppDataSource.manager.findOne(Role, { where: { id: patientData.role_id }, });
      if (!role) {
        throw new Error('Rol no encontrado');
      }
      user.role = role;
      await queryRunner.manager.save(user);

      // 3. Crear Paciente
      const patient = new Patient();
      patient.person = person;
      patient.insurance_number = '0';
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

  async registerAdmin(
    adminData: {
      firstName: string;
      lastName: string;
      dpi: string;
      email: string;
      password: string;
      seconf_password: string;
      birth_date: Date;
      gender: string; //1 hombre, 0 mujer
      phone: string;
      address: string;
      role_id: number;  
  },
  file?: Express.Multer.File
  ){
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      if(adminData.password === adminData.seconf_password){
        throw new Error("Las constrasenas no pueden ser iguales");
      }
      const person = new Person();
    // subi foto si tiene
    if (file){
        const filename = `${uuidv4()}_${file.originalname}`;
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.S3_BUCKET!,
              Key: `fotos/${filename}`,
              Body: file.buffer,
              ContentType: file.mimetype,
            })
        );

        const photoUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/fotos/${filename}`;
        person.photo = photoUrl;
    }
      // 1. Crear Persona
      
      person.first_name = adminData.firstName;
      person.last_name = adminData.lastName;
      person.national_id = adminData.dpi;
      person.email = adminData.email;
      person.birth_date = adminData.birth_date;
      person.gender = adminData.gender;
      person.phone = adminData.phone;
      person.address = adminData.address;
      await queryRunner.manager.save(person);

      // 2. Crear Usuario (con contraseña encriptada)
      const user = new User();
      user.name = adminData.firstName+adminData.lastName;
      user.email = adminData.email;
      user.password = await hashPassword(adminData.password);
      user.remember_token = await hashPassword(adminData.seconf_password);
      user.email_verified_at = new Date();
      user.person = person;
      const role = await AppDataSource.manager.findOne(Role, {where: {id: adminData.role_id},});
      if (!role){
        throw new Error('Rol no encontrado');
      }
      user.role = role;
      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
      return { success: true, userId: user.id };
    } catch (error:any){
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  }
  
  async registerDoctor(
    doctorData: {
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
      employee_number: string;
      id_specialty: number;
      name_department: string;
      direccion_department: string;
    },
    file: Express.Multer.File
  ) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!file) throw new Error('La foto de perfil es obligatoria');
      //subir a s3
      const filename = `${uuidv4()}_${file.originalname}`;
      const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET!,
          Key: `fotos/${filename}`,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const photoUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/fotos/${filename}`;

      //Crear Persona
      const person = new Person();
      person.first_name = doctorData.firstName;
      person.last_name = doctorData.lastName;
      person.national_id = doctorData.dpi;
      person.email = doctorData.email;
      person.birth_date = doctorData.birth_date;
      person.gender = doctorData.gender;
      person.phone = doctorData.phone;
      person.address = doctorData.address;
      person.photo = photoUrl;
      await queryRunner.manager.save(person);

      // Crear Usuario
      const user = new User();
      user.name = doctorData.firstName + doctorData.lastName;
      user.email = doctorData.email;
      user.password = await hashPassword(doctorData.password);
      user.person = person;
      user.remember_token = undefined;
      user.email_verified_at = undefined;

      const role = await AppDataSource.manager.findOne(Role, { where: { id: doctorData.role_id }, });
      if (!role) {
        throw new Error('Rol no encontrado');
      }
      user.role = role;
      await queryRunner.manager.save(user);

      //Crear Empleado 
      const employee = new Employee();
      employee.employee_number = doctorData.employee_number;
      employee.hire_date = new Date();
      employee.salary = 0;
      employee.person = person;
      await queryRunner.manager.save(employee);

      //Crear relacion doctor con especialidades
      const employee_specialty = new EmployeeSpecialty();
      const speciality = await AppDataSource.manager.findOne(Specialty, { where: { id: doctorData.id_specialty } })
      if (!speciality) {
        throw new Error('Especialidad no encontrada');
      }
      employee_specialty.specialty = speciality;
      employee_specialty.employee = employee;
      await queryRunner.manager.save(employee_specialty);

      //Crear departmento (direccion de la clinica)
      const department = new Department();
      department.name = doctorData.name_department;
      department.location = doctorData.direccion_department;
      await queryRunner.manager.save(department);

      //Crear Relacion doctor con departamentos
      const employeeDeparment = new EmployeeDepartmetn();
      employeeDeparment.department = department;
      employeeDeparment.employee = employee;
      await queryRunner.manager.save(department);

      await queryRunner.commitTransaction();
      return { success: true, userId: user.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  
  }

  async login(userData: { email: string; password: string }) {
    const user = await AppDataSource.manager.findOne(User, {
      where: { email: userData.email },
      relations: ['person', 'role']
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const passwordMatch = await comparePassword(userData.password, user.password);
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta, prueba de nuevo!');
    }
    console.log(user.role.name);
    if (user.role.name !== 'administrador' && !user.approved) {
      return { success: false, message: "Usuario no aprobado" };
    }

    const token = jwt.sign({ id: user.id, rol: user.role.name }, JWT_SECRET, { expiresIn: '1h' });

    if (user.role.name === 'administrador') {
      return { token, requiresAuth2: true };
    }


    return { success: true, message: "Usuario logeado satisfactoriamente!", role: user.role };

  }
  async approvedUser(userId: number) {
    const user = await AppDataSource.manager.findOne(User, {
      where: { id: userId },
      relations: ['person', 'role']
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    user.approved = true;
    await AppDataSource.manager.save(user);

    return { message: "Usuario validado correctamente", success: true };
  }

  async approvedAdmin(token: string, files: Express.Multer.File) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.rol !== 'administrador') {
        throw new Error('No tienes permiso para aprobar usuarios');
      }
      if (!files) {
        throw new Error('archivo requerido');
      }
      const user = await AppDataSource.manager.findOne(User, {
        where: { id: decoded.id },
        relations: ['person', 'role']
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (!user.remember_token) {
        throw new Error('Token de autenticación no encontrado');
      }

      const contenidoArchivo = files.buffer.toString('utf-8').trim();

      // Ensure both arguments are strings for bcrypt.compare
      const valid = await bcrypt.compare(
        contenidoArchivo,
        user.remember_token.toString()
      );

      if (!valid) {
        return { success: false, message: 'No es valida la contraseña del archivo' };
      }
      const finalToken = jwt.sign({ id: decoded.id, rol: 'administrador', auth2: true }, JWT_SECRET, { expiresIn: '1h' });
      return { token: finalToken, success: true };


    } catch (error) {
      throw error;
    }
  }

}
