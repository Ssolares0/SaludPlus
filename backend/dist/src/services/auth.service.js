"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const Postgres_1 = require("../config/database/Postgres");
const Person_entity_1 = require("../models/Person.entity");
const User_entity_1 = require("../models/User.entity");
const Patient_entity_1 = require("../models/Patient.entity");
const Role_entity_1 = require("../models/Role.entity");
const bycript_1 = require("../utils/bycript");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const dotenv_1 = require("dotenv");
const Employe_entity_1 = require("../models/Employe.entity");
const Specialty_entity_1 = require("../models/Specialty.entity");
const EmployeeSpecialties_entity_1 = require("../models/EmployeeSpecialties.entity");
const Department_1 = require("../models/Department");
const EmployeeDepartment_entity_1 = require("../models/EmployeeDepartment.entity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = 'AYD12025';
(0, dotenv_1.configDotenv)();
class AuthService {
    async registerPatient(patientData, file) {
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const person = new Person_entity_1.Person();
            // subi foto si tiene
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
            const user = new User_entity_1.User();
            user.name = patientData.firstName + patientData.lastName;
            user.email = patientData.email;
            user.password = await (0, bycript_1.hashPassword)(patientData.password);
            user.person = person;
            const role = await Postgres_1.AppDataSource.manager.findOne(Role_entity_1.Role, { where: { id: patientData.role_id }, });
            if (!role) {
                throw new Error('Rol no encontrado');
            }
            user.role = role;
            await queryRunner.manager.save(user);
            // 3. Crear Paciente
            const patient = new Patient_entity_1.Patient();
            patient.person = person;
            patient.insurance_number = '0';
            await queryRunner.manager.save(patient);
            await queryRunner.commitTransaction();
            return { success: true, userId: user.id };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async registerAdmin(adminData, file) {
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (adminData.password === adminData.seconf_password) {
                throw new Error("Las constrasenas no pueden ser iguales");
            }
            const person = new Person_entity_1.Person();
            // subi foto si tiene
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
            const user = new User_entity_1.User();
            user.name = adminData.firstName + adminData.lastName;
            user.email = adminData.email;
            user.password = await (0, bycript_1.hashPassword)(adminData.password);
            user.remember_token = await (0, bycript_1.hashPassword)(adminData.seconf_password);
            user.email_verified_at = new Date();
            user.person = person;
            const role = await Postgres_1.AppDataSource.manager.findOne(Role_entity_1.Role, { where: { id: adminData.role_id }, });
            if (!role) {
                throw new Error('Rol no encontrado');
            }
            user.role = role;
            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return { success: true, userId: user.id };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async registerDoctor(doctorData, file) {
        const queryRunner = Postgres_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!file)
                throw new Error('La foto de perfil es obligatoria');
            //subir a s3
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
            //Crear Persona
            const person = new Person_entity_1.Person();
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
            const user = new User_entity_1.User();
            user.name = doctorData.firstName + doctorData.lastName;
            user.email = doctorData.email;
            user.password = await (0, bycript_1.hashPassword)(doctorData.password);
            user.person = person;
            user.remember_token = undefined;
            user.email_verified_at = undefined;
            const role = await Postgres_1.AppDataSource.manager.findOne(Role_entity_1.Role, { where: { id: doctorData.role_id }, });
            if (!role) {
                throw new Error('Rol no encontrado');
            }
            user.role = role;
            await queryRunner.manager.save(user);
            //Crear Empleado 
            const employee = new Employe_entity_1.Employee();
            employee.employee_number = doctorData.employee_number;
            employee.hire_date = new Date();
            employee.salary = 0;
            employee.person = person;
            await queryRunner.manager.save(employee);
            //Crear relacion doctor con especialidades
            const employee_specialty = new EmployeeSpecialties_entity_1.EmployeeSpecialty();
            const speciality = await Postgres_1.AppDataSource.manager.findOne(Specialty_entity_1.Specialty, { where: { id: doctorData.id_specialty } });
            if (!speciality) {
                throw new Error('Especialidad no encontrada');
            }
            employee_specialty.specialty = speciality;
            employee_specialty.employee = employee;
            await queryRunner.manager.save(employee_specialty);
            //Crear departmento (direccion de la clinica)
            const department = new Department_1.Department();
            department.name = doctorData.name_department;
            department.location = doctorData.direccion_departamento;
            await queryRunner.manager.save(department);
            //Crear Relacion doctor con departamentos
            const employeeDeparment = new EmployeeDepartment_entity_1.EmployeeDepartmetn();
            employeeDeparment.department = department;
            employeeDeparment.employee = employee;
            await queryRunner.manager.save(employeeDeparment);
            await queryRunner.commitTransaction();
            return { success: true, userId: user.id };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async login(userData) {
        const user = await Postgres_1.AppDataSource.manager.findOne(User_entity_1.User, {
            where: { email: userData.email },
            relations: ['person', 'role']
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const passwordMatch = await (0, bycript_1.comparePassword)(userData.password, user.password);
        if (!passwordMatch) {
            throw new Error('Contraseña incorrecta, prueba de nuevo!');
        }
        console.log(user.role.name);
        if (user.role.name !== 'administrador' && !user.approved) {
            return { success: false, message: "Usuario no aprobado" };
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, rol: user.role.name }, JWT_SECRET, { expiresIn: '1h' });
        if (user.role.name === 'administrador') {
            return { token, requiresAuth2: true };
        }
        let patientId = null;
        let doctorId = null;
        if (user.role.name === 'paciente') {
            const patient = await Postgres_1.AppDataSource.manager.findOne(Patient_entity_1.Patient, {
                where: { person: { id: user.person.id } },
            });
            if (patient) {
                patientId = patient.id;
            }
        }
        else if (user.role.name === 'doctor') {
            const employee = await Postgres_1.AppDataSource.manager.findOne(Employe_entity_1.Employee, {
                where: { person: { id: user.person.id } },
            });
            if (employee) {
                doctorId = employee.id;
            }
        }
        return {
            success: true,
            message: "Usuario logeado satisfactoriamente!",
            role: user.role.name,
            userId: user.id,
            peopleId: user.person.id,
            token,
            patientId,
            doctorId
        };
    }
    async approvedUser(userId) {
        const user = await Postgres_1.AppDataSource.manager.findOne(User_entity_1.User, {
            where: { id: userId },
            relations: ['person', 'role']
        });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        user.approved = true;
        await Postgres_1.AppDataSource.manager.save(user);
        return { message: "Usuario validado correctamente", success: true };
    }
    async approvedAdmin(token, files) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (decoded.rol !== 'administrador') {
                throw new Error('No tienes permiso para aprobar usuarios');
            }
            if (!files) {
                throw new Error('archivo requerido');
            }
            const user = await Postgres_1.AppDataSource.manager.findOne(User_entity_1.User, {
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
            const valid = await bcrypt_1.default.compare(contenidoArchivo, user.remember_token.toString());
            if (!valid) {
                return { success: false, message: 'No es valida la contraseña del archivo' };
            }
            const finalToken = jsonwebtoken_1.default.sign({ id: decoded.id, rol: 'administrador', auth2: true }, JWT_SECRET, { expiresIn: '1h' });
            return { token: finalToken, success: true };
        }
        catch (error) {
            throw error;
        }
    }
}
exports.AuthService = AuthService;
