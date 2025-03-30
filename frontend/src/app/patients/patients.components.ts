import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './patients.service';
import { Doctor } from './patients.models';

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
    availableHours: any[] = [];
    selectedDoctor: Doctor | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.loadDoctors();
    }

    loadDoctors() {
        this.loading = true;
        this.error = '';
        
        this.authService.getAvailableDoctors(2).subscribe({
            next: (doctors) => {
                console.log('Doctores recibidos:', doctors);
                this.doctors = doctors;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error:', error);
                this.error = error.message;
                this.loading = false;
            }
        });
    }

    filterByEspecialidad(especialidad: string) {
        if (!especialidad) {
            this.loadDoctors();
            return;
        }
        
        this.doctors = this.doctors.filter(doctor => 
            doctor.especialidad.includes(especialidad)
        );
    }

    viewSchedule(doctor: Doctor) {
        this.selectedDoctor = doctor;
        this.showSchedule = true;
        this.generateAvailableHours();
    }

    generateAvailableHours() {
        // Generamos horas disponibles de 8 AM a 5 PM
        const hours = [];
        for (let hour = 8; hour <= 17; hour++) {
            hours.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                available: Math.random() > 0.3 // Simulamos disponibilidad aleatoria
            });
        }
        this.availableHours = hours;
    }

    scheduleAppointment() {
        if (!this.validateAppointmentForm()) {
            return;
        }

        console.log('Cita agendada:', {
            doctor: this.selectedDoctor?.nombre,
            date: this.appointmentDate,
            time: this.appointmentTime,
            reason: this.appointmentReason
        });

        // Aquí irá la lógica para guardar la cita en el backend
        alert('Cita agendada con éxito');
        this.resetAppointmentForm();
    }

    validateAppointmentForm(): boolean {
        if (!this.appointmentDate) {
            alert('Por favor seleccione una fecha');
            return false;
        }
        if (!this.appointmentTime) {
            alert('Por favor seleccione una hora');
            return false;
        }
        if (!this.appointmentReason) {
            alert('Por favor ingrese el motivo de la consulta');
            return false;
        }
        return true;
    }

    resetAppointmentForm() {
        this.showAppointmentForm = false;
        this.appointmentDate = '';
        this.appointmentTime = '';
        this.appointmentReason = '';
        this.selectedDoctor = null;
    }

    selectTimeSlot(slot: any) {
        if (slot.available) {
            this.appointmentTime = slot.time;
        }
    }

    closeScheduleView() {
        this.showSchedule = false;
        this.selectedDoctor = null;
    }

    getUniqueSpecialties(): string[] {
        const specialties = new Set<string>();
        this.doctors.forEach(doctor => {
            doctor.especialidad.forEach(esp => specialties.add(esp));
        });
        return Array.from(specialties);
    }
}