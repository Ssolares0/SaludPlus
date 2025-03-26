import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SelectTypeAccountComponent } from './auth/select-type-account/select-type-account.component';
import { RegisterDoctorComponent } from './auth/register-doctor/register-doctor.component';
import { RegisterPatientComponent } from './auth/register-patient/register-patient.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AcceptPatientsComponent } from './admin/accept-patients/accept-patients.component';
import { AcceptDoctorsComponent } from './admin/accept-doctors/accept-doctors.component';
import { ViewPatientsComponent } from './admin/view-patients/view-patients.component';
import { ViewDoctorsComponent } from './admin/view-doctors/view-doctors.component';
import { ReportsComponent } from './admin/reports/reports.component';

export const routes: Routes = [
    { path: '', title: "SaludPlus", component: LoginComponent },
    { path: 'select-type-account', title: "Seleccionar tipo de cuenta", component: SelectTypeAccountComponent },
    { path: 'register-doctor', title: "Registro de médico", component: RegisterDoctorComponent },
    { path: 'register-patient', title: "Registro de paciente", component: RegisterPatientComponent },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'accept-patients',
                title: "Aceptar pacientes",
                component: AcceptPatientsComponent
            },
            {
                path: 'accept-doctors',
                title: "Aceptar médicos",
                component: AcceptDoctorsComponent
            },
            {
                path: 'view-patients',
                title: "Ver pacientes",
                component: ViewPatientsComponent
            },
            {
                path: 'view-doctors',
                title: "Ver médicos",
                component: ViewDoctorsComponent
            },
            {
                path: 'reports',
                title: "Reportes",
                component: ReportsComponent
            },
            {
                path: '',
                redirectTo: 'reports',
                pathMatch: 'full'
            }
        ]
    }
];