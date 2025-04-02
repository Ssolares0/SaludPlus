import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientsService } from './patients.service';
import { Doctor, TimeSlot, ActiveAppointment, DoctorSchedule } from './patients.models';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class PatientsComponent implements OnInit {
    doctors: Doctor[] = [];
    loading: boolean = false;
    error: string = '';
    selectedEspecialidad: string = '';
    showSchedule: boolean = false;
    showAppointmentForm: boolean = false;
    selectedDate: string = '';
    appointmentDate: string = '';
    appointmentTime: string = '';
    appointmentReason: string = '';
    availableHours: TimeSlot[] = [];
    selectedDoctor: Doctor | null = null;
    doctorSchedule: DoctorSchedule | null = null;
    showActiveAppointments: boolean = false;
    activeAppointments: ActiveAppointment[] = [];

    constructor(
        private patientsService: PatientsService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadDoctors();
    }

    loadDoctors() {
        this.loading = true;
        this.error = '';
        
        this.patientsService.getAvailableDoctors(2).subscribe({
            next: (doctors) => {
                this.doctors = doctors;
                this.loading = false;
            },
            error: (error) => {
                this.error = error.message;
                this.loading = false;
            }
        });
    }

    filterByEspecialidad(especialidad: string) {
        this.loading = true;
        this.error = '';
        
        if (!especialidad || especialidad === '') {
            this.loadDoctors();
            return;
        }
    
        this.patientsService.getDoctorsBySpeciality(especialidad).subscribe({
            next: (doctors) => {
                this.doctors = doctors;
                this.loading = false;
            },
            error: (error) => {
                this.error = error.message;
                this.loading = false;
            }
        });
    }

    viewSchedule(doctor: Doctor) {
        this.selectedDoctor = doctor;
        this.showSchedule = true;
        this.error = '';
        
        const today = new Date();
        this.selectedDate = today.toISOString().split('T')[0];
        
        this.generateAvailableHours();
    }

    generateAvailableHours() {
        if (!this.selectedDoctor || !this.selectedDate) return;

        this.loading = true;
        this.error = '';
        this.availableHours = [];
        this.doctorSchedule = null;

        const formattedDate = `${this.selectedDate} 17:05:33.000000`;

        this.patientsService.getDoctorSchedule(
            this.selectedDoctor.id.toString(),
            formattedDate
        ).subscribe({
            next: (response) => {
                if (response && response.data) {
                    this.doctorSchedule = response.data.doctorSchedule;
                    this.availableHours = response.data.availability;
                } else {
                    this.error = 'No se pudieron cargar los horarios';
                }
                this.loading = false;
            },
            error: (error) => {
                this.error = 'Error al cargar los horarios';
                this.loading = false;
                console.error('Error:', error);
            }
        });
    }

    selectTimeSlot(slot: TimeSlot) {
        if (slot.isAvailable) {
            this.appointmentTime = slot.time;
            this.appointmentDate = this.selectedDate;
            this.showAppointmentForm = true;
        }
    }

    scheduleAppointment() {
        if (!this.validateAppointmentForm()) return;

        console.log('Cita agendada:', {
            doctorId: this.selectedDoctor?.id,
            date: this.appointmentDate,
            time: this.appointmentTime,
            reason: this.appointmentReason
        });

        this.resetAppointmentForm();
    }

    validateAppointmentForm(): boolean {
        if (!this.appointmentDate) {
            this.error = 'Por favor seleccione una fecha';
            return false;
        }
        if (!this.appointmentTime) {
            this.error = 'Por favor seleccione una hora';
            return false;
        }
        if (!this.appointmentReason) {
            this.error = 'Por favor ingrese el motivo de la consulta';
            return false;
        }
        return true;
    }
    resetAppointmentForm() {
        // Reiniciar el formulario de cita
        this.showAppointmentForm = false;
        this.appointmentDate = '';
        this.appointmentTime = '';
        this.appointmentReason = '';
        
        // Volver a mostrar el modal de horarios
        this.showSchedule = true;
        
        // Limpiar selección del horario
        this.availableHours = this.availableHours.map(slot => ({
            ...slot,
            isAvailable: true
        }));
    }

    closeScheduleView() {
        this.showSchedule = false;
        this.selectedDoctor = null;
        this.doctorSchedule = null;
        this.availableHours = [];
        this.error = '';
    }

    getUniqueSpecialties(): string[] {
        const specialties = new Set<string>();
        this.doctors.forEach(doctor => {
            doctor.especialidad.forEach(esp => specialties.add(esp));
        });
        return Array.from(specialties);
    }

    loadActiveAppointments() {
        this.loading = true;
        this.error = '';
        
        this.patientsService.getActiveAppointments(7).subscribe({
            next: (response) => {
                if (!response.error) {
                    this.activeAppointments = response.data;
                    this.showActiveAppointments = true;
                } else {
                    this.error = 'Error al cargar las citas';
                }
                this.loading = false;
            },
            error: (error) => {
                this.error = error.message;
                this.loading = false;
            }
        });
    }
    
    logout() {
        localStorage.clear();
        this.router.navigate(['/']);
    }
}