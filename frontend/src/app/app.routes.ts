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
import { authGuard, adminGuard, noAuthGuard, patientGuard, doctorGuard } from './core/guards/guards';
import { PatientsComponent } from './patients/patients.components';
import { DoctorLayoutComponent } from './doctor/doctor-layout/doctor-layout.component';
import { AppointmentsComponent } from './doctor/appointments/appointments.component';
import { SchedulesComponent } from './doctor/schedules/schedules.component';
import { HistoryComponent } from './doctor/history/history.component';
import { ProfileComponent } from './doctor/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        title: "SaludPlus", 
        component: LoginComponent,
        canActivate: [noAuthGuard]
    },
    { 
        path: 'select-type-account', 
        title: "Seleccionar tipo de cuenta", 
        component: SelectTypeAccountComponent,
        canActivate: [noAuthGuard]
    },
    { 
        path: 'register-doctor', 
        title: "Registro de médico", 
        component: RegisterDoctorComponent,
        canActivate: [noAuthGuard]
    },
    { 
        path: 'register-patient', 
        title: "Registro de paciente", 
        component: RegisterPatientComponent,
        canActivate: [noAuthGuard]
    },
    { 
        path: 'patients', 
        title: "Patients", 
        component: PatientsComponent,
        canActivate: [patientGuard]
    },
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [authGuard, adminGuard],
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
    },
    {
        path: 'doctor',
        component: DoctorLayoutComponent,
        canActivate: [doctorGuard],
        children: [
            {
                path: 'appointments',
                title: "Gestión de citas",
                component: AppointmentsComponent
            },
            {
                path: 'schedules',
                title: "Gestión de horarios",
                component: SchedulesComponent
            },
            {
                path: 'history',
                title: "Historial médico",
                component: HistoryComponent
            },
            {
                path: 'profile',
                title: "Perfil médico",
                component: ProfileComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];