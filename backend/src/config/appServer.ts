import express from 'express';
import cors from 'cors'
import { connectPg } from './database/Postgres';
import { authRouter } from '../routers/auth.routes';
import { employeeRouter } from '../routers/employee.routes';
import { patientRouter } from '../routers/patient.routes';
import { adminRouter } from '../routers/admin.routes';

const PORT = 3001;
const app = express();

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