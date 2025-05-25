import "reflect-metadata";
import express from 'express';
import cors from 'cors'
import { connectPg } from './database/Postgres';
import { authRouter } from '../routers/auth.routes';
import { employeeRouter } from '../routers/employee.routes';
import { patientRouter } from '../routers/patient.routes';
import { adminRouter } from '../routers/admin.routes';

import '../models/Appointments.entity';
import '../models/Department';
import '../models/DoctorSchedule.entity';
import '../models/EmergencieContac.entity'
import '../models/Employe.entity'
import '../models/EmployeeDepartment.entity'
import '../models/EmployeeSpecialties.entity'
import '../models/Patient.entity'
import '../models/PatientDepartment.entity'
import '../models/Person.entity'
import '../models/Role.entity'
import '../models/Specialty.entity'
import '../models/User.entity'

const PORT = 3001;
export const app = express();

app.use(
    cors({
        origin: '*', 
        methods: ['GET', 'POST', 'PUT', 'DELETE'], 
        allowedHeaders: ['Content-Type', 'Authorization'] 
    })
)

connectPg();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
  
app.get('/version', (req, res) => {
res.status(200).json({ version: '1.0.0' });
});

//Rutas
app.use('/auth', authRouter);
app.use('/employee', employeeRouter);
app.use('/patient', patientRouter);
app.use('/admin', adminRouter);
  

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});