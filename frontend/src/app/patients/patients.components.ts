import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// import { PatientsComponent } from './patients/patients.components';
//     {path: 'patients', title: "Portal del Paciente", component: PatientsComponent}

interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  address: string;
  photo: string;
  schedule: {
    days: string[];
    hours: { start: string; end: string; }
  };
}

interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PatientsComponent implements OnInit {
  doctors: Doctor[] = [];
  specialties: string[] = ['Cardiología', 'Pediatría', 'Dermatología', 'Medicina General'];
  selectedSpecialty: string = '';
  selectedDoctor: Doctor | null = null;
  showSchedule: boolean = false;
  showAppointmentForm: boolean = false;
  showCancelModal: boolean = false;
  selectedDate: string = '';
  appointmentDate: string = '';
  appointmentTime: string = '';
  appointmentReason: string = '';
  availableHours: TimeSlot[] = [];
  availableSlots: string[] = [];

  constructor() { }

  ngOnInit() {
    this.loadDoctors();
    this.loadSpecialties();
  }

  loadDoctors() {
    // Simular carga de datos de la API
    this.doctors = [
      {
        id: 1,
        fullName: 'Dr. Juan Pérez',
        specialty: 'Cardiología',
        address: 'Calle Principal #123',
        photo: 'assets/doctor1.jpg',
        schedule: {
          days: ['Lunes', 'Martes', 'Miércoles'],
          hours: { start: '08:00', end: '16:00' }
        }
      },
      {
        id: 2,
        fullName: 'Dra. María García',
        specialty: 'Pediatría',
        address: 'Avenida Central #456',
        photo: 'assets/doctor2.jpg',
        schedule: {
          days: ['Martes', 'Jueves', 'Viernes'],
          hours: { start: '09:00', end: '17:00' }
        }
      }
    ];
  }

  loadSpecialties() {
    // En un caso real, esto vendría de la API
    this.specialties = [...new Set(this.doctors.map(doctor => doctor.specialty))];
  }

  searchDoctors() {
    if (this.selectedSpecialty) {
      this.doctors = this.doctors.filter(doctor => 
        doctor.specialty === this.selectedSpecialty
      );
    } else {
      this.loadDoctors(); // Recargar todos los doctores
    }
  }

  viewSchedule(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.showSchedule = true;
    this.generateAvailableHours();
  }

  generateAvailableHours() {
    if (!this.selectedDoctor) return;
    
    const start = parseInt(this.selectedDoctor.schedule.hours.start.split(':')[0]);
    const end = parseInt(this.selectedDoctor.schedule.hours.end.split(':')[0]);
    
    this.availableHours = [];
    for (let hour = start; hour < end; hour++) {
      this.availableHours.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3 // Simulación de disponibilidad
      });
    }
  }

  scheduleAppointment() {
    if (!this.validateAppointment()) return;

    // Simular guardado de cita
    alert('Cita agendada correctamente');
    this.showAppointmentForm = false;
    this.resetForm();
  }

  validateAppointment(): boolean {
    if (!this.selectedDoctor) return false;
    
    const appointmentDay = new Date(this.appointmentDate).getDay();
    const daysMap: { [key: string]: number } = {
      'Lunes': 1,
      'Martes': 2,
      'Miércoles': 3,
      'Jueves': 4,
      'Viernes': 5
    };
    
    const availableDays = this.selectedDoctor.schedule.days.map(day => daysMap[day]);
  
    if (!availableDays.includes(appointmentDay)) {
      alert('El doctor no atiende este día');
      return false;
    }
  
    return true;
  }

  confirmCancelAppointment() {
    if (confirm('¿Está seguro que desea cancelar la cita?')) {
      // Simular cancelación de cita
      alert('Cita cancelada correctamente');
      this.showCancelModal = false;
    }
  }

  private resetForm() {
    this.appointmentDate = '';
    this.appointmentTime = '';
    this.appointmentReason = '';
  }
}