import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SelectTypeAccountComponent } from './auth/select-type-account/select-type-account.component';
import { RegisterDoctorComponent } from './auth/register-doctor/register-doctor.component';
import { RegisterPatientComponent } from './auth/register-patient/register-patient.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    {path: '', title: "SaludPlus", component: LoginComponent},
    {path: 'select-type-account', title: "Seleccionar tipo de cuenta", component: SelectTypeAccountComponent},
    {path: 'register-doctor', title: "Registro de médico", component: RegisterDoctorComponent},
    {path: 'register-patient', title: "Registro de paciente", component: RegisterPatientComponent},
    {path: 'admin/dashboard', title: "Dashboard de administrador", component: AdminDashboardComponent}
];
