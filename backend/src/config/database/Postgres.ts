import "reflect-metadata";
import { DataSource } from 'typeorm';
import * as dns from 'dns';
import * as dotenv from 'dotenv';

dotenv.config();

import { User } from '../../models/User.entity';
import { Person } from '../../models/Person.entity';
import { Employee } from '../../models/Employe.entity';
import { Patient } from '../../models/Patient.entity';
import { Role } from '../../models/Role.entity';
import { Department } from '../../models/Department';
import { Appointment } from '../../models/Appointments.entity';
import { DoctorSchedule } from '../../models/DoctorSchedule.entity';
import { EmergencyContact } from '../../models/EmergencieContac.entity';
import { EmployeeDepartmetn } from '../../models/EmployeeDepartment.entity';
import { EmployeeSpecialty } from '../../models/EmployeeSpecialties.entity';
import { PatientDepartment } from '../../models/PatientDepartment.entity';
import { Specialty } from '../../models/Specialty.entity';
import { Medication } from "../../models/Medications.entity";
import { Treatment } from "../../models/Treatments.entity";
import { Reports } from "../../models/Reports.entity";
import { Rating } from "../../models/Ratings.entity";

// Forzar IPv4 para las conexiones
dns.setDefaultResultOrder('ipv4first');

// Determinar el entorno (development o production)
const isProduction = process.env.NODE_ENV === 'production';

// Configuración de conexión para cada entorno
const dbConfig = {
    development: {
        // Conexión directa (funciona en local con IPv6)
        host: "db.ayvouzycmojxlbcxhquy.supabase.co",
        port: 5432,
        username: "postgres",
        password: "AYD1_G8_1S2025",
    },
    production: {
        // Session Pooler (funciona en GCP con IPv4)
        host: "aws-0-us-west-1.pooler.supabase.com",
        port: 5432,
        username: "postgres.ayvouzycmojxlbcxhquy",
        password: "AYD1_G8_1S2025",
    }
};

// Seleccionar la configuración según el entorno
const config = isProduction ? dbConfig.production : dbConfig.development;

// Mostrar información sobre la conexión que se va a utilizar
console.log(`Configurando conexión para entorno: ${isProduction ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
console.log(`Host: ${config.host}, Puerto: ${config.port}, Usuario: ${config.username}`);

// Crear la conexión a la base de datos
export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: 'postgres',
    entities: [
        User, Person, Employee, Patient, Role, Department,
        Appointment, DoctorSchedule, EmergencyContact,
        EmployeeDepartmetn, EmployeeSpecialty, PatientDepartment, Specialty, Medication, Treatment, Reports, Rating
    ],
    synchronize: false,
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false
        },
        family: 4  // Forzar IPv4
    }
});

// Función para conectar a la base de datos
export const connectPg = async () => {
    try {
        console.log(`Conectando a PostgreSQL en ${config.host}:${config.port}...`);

        await AppDataSource.initialize();
        console.log("✅ Conexión establecida exitosamente");

        // Verificar entidades registradas
        const entityNames = AppDataSource.entityMetadatas.map(metadata => metadata.name);
        console.log('Entidades registradas:', entityNames);

        const result = await AppDataSource.query('SELECT NOW()');
        console.log('Hora del servidor PostgreSQL:', result[0].now);

        return true;
    } catch (err) {
        console.error('❌ Error de conexión a PostgreSQL:', err);
        console.error('Detalles del error:', err instanceof Error ? err.message : String(err));

        if (err instanceof Error && err.stack) {
            console.error('Stack trace:', err.stack);
        }

        return false;
    }
};