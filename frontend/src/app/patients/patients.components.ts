import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientsService } from './patients.service';
import { Doctor, TimeSlot, ActiveAppointment, DoctorSchedule, AppointmentBody } from './patients.models';
import { SafeImagePipe } from '../core/pipes/safe-image.pipe';

@Component({
    selector: 'app-patients',
    templateUrl: './patients.component.html',
    styleUrls: ['./patients.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, SafeImagePipe]
})

export class PatientsComponent implements OnInit {
    doctors: Doctor[] = [];
    filteredDoctors: Doctor[] = [];
    specialties: string[] = [];
    loading: boolean = false;
    successMessage: string = '';
    patientId: number = localStorage.getItem('patientId') ? parseInt(localStorage.getItem('patientId') || '') : 0;
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

        const userId = Number(localStorage.getItem('patientId'));

        this.patientsService.getAvailableDoctors(userId).subscribe({
            next: (doctors) => {
                console.log('Doctores cargados:', doctors);
                this.doctors = doctors;
                this.filteredDoctors = [...doctors];
                this.updateSpecialties();
                this.loading = false;
            },
            error: (error) => {
                this.error = error.message;
                this.loading = false;
            }
        });
    }

    updateSpecialties() {
        const specialties = new Set<string>();

        if (this.doctors && Array.isArray(this.doctors)) {
            this.doctors.forEach(doctor => {
                if (doctor.especialidad && Array.isArray(doctor.especialidad)) {
                    doctor.especialidad.forEach(esp => {
                        if (esp) specialties.add(esp);
                    });
                }
            });
        }

        this.specialties = Array.from(specialties);
    }

    filterByEspecialidad(especialidad: string) {
        this.selectedEspecialidad = especialidad;

        if (!especialidad || especialidad === '') {
            this.filteredDoctors = [...this.doctors];
            return;
        }

        this.filteredDoctors = this.doctors.filter(doctor =>
            doctor.especialidad &&
            doctor.especialidad.some(esp =>
                esp.toLowerCase() === especialidad.toLowerCase()
            )
        );

        console.log(`Filtrado por ${especialidad}: ${this.filteredDoctors.length} doctores encontrados`);
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

        console.log(`Consultando horarios para doctor ID ${this.selectedDoctor.id} en fecha ${this.selectedDate}`);

        const dateToSend = this.selectedDate;

        this.patientsService.getDoctorSchedule(
            this.selectedDoctor.doctorId,
            dateToSend
        ).subscribe({
            next: (response) => {
                console.log('Respuesta exitosa:', response);
                if (response && response.data) {
                    const responseDay = response.data.doctorSchedule.day;
                    const selectedDay = this.getDayName(new Date(this.selectedDate));

                    if (responseDay !== selectedDay) {
                        response.data.doctorSchedule.day = selectedDay;
                    }

                    this.doctorSchedule = response.data.doctorSchedule;
                    this.availableHours = response.data.availability;
                } else {
                    this.error = 'No se pudieron cargar los horarios';
                }
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar horarios:', error);
                this.error = 'Error al cargar los horarios: ' + error.message;
                this.loading = false;
            }
        });
    }

    getDayName(date: Date): string {
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dayNames[date.getDay()];
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
        
        this.loading = true;
        this.error = '';
        this.successMessage = '';
        
        const appointmentData: AppointmentBody = {
            date: this.appointmentDate,
            hour: this.appointmentTime,
            motive: this.appointmentReason,
            doctorId: this.selectedDoctor?.doctorId || '',
        };
        
        console.log('Enviando solicitud de cita:', appointmentData);
        
        this.patientsService.createAppointment(this.patientId, appointmentData).subscribe({
            next: (response) => {
                console.log('Respuesta del servidor:', response);
                this.loading = false;
                
                if (!response.error) {
                    this.successMessage = 'Cita agendada exitosamente';
                    
                    setTimeout(() => {
                        this.resetAppointmentForm();
                        this.generateAvailableHours(); 
                    }, 3000);
                } else {
                    this.error = response.message || 'Error al agendar la cita';
                }
            },
            error: (error) => {
                console.error('Error al agendar cita:', error);
                this.error = 'Error al agendar cita: ' + error.message;
                this.loading = false;
            }
        });
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
        this.showAppointmentForm = false;
        this.appointmentDate = '';
        this.appointmentTime = '';
        this.appointmentReason = '';

        this.showSchedule = true;

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
        return this.specialties;
    }

    loadActiveAppointments() {
        this.loading = true;
        this.error = '';

        const userId = Number(localStorage.getItem('patientId'));

        this.patientsService.getActiveAppointments(userId).subscribe({
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