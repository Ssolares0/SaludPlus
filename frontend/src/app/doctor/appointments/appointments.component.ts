import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Calendar, Clock, FileText, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-angular';
import { DoctorService } from '../services/doctor.service';
import { PendingAppointmentResponse } from '../models/doctor.model';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, SafeImagePipe],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})

export class AppointmentsComponent implements OnInit {
  searchControl = new FormControl('');
  treatmentForm!: FormGroup;

  appointments: PendingAppointmentResponse[] = [];
  filteredAppointments: PendingAppointmentResponse[] = [];

  showTreatmentModal = false;
  selectedAppointment: PendingAppointmentResponse | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setupForms();
    this.loadAppointments();

    this.searchControl.valueChanges.subscribe(value => {
      this.filterAppointments();
      this.cdr.markForCheck();
    });
  }

  setupForms(): void {
    this.treatmentForm = new FormGroup({
      treatmentText: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  loadAppointments(): void {
    const doctorId = Number(localStorage.getItem('doctorId'));

    if (!doctorId) {
      this.error = 'Error: No se pudo identificar al doctor.';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.doctorService.getPendintgAppointments(doctorId).subscribe({
      next: (appointments) => {
        this.appointments = appointments;
        this.filteredAppointments = appointments;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Error al cargar las citas. Por favor, intente nuevamente.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error loading appointments:', error);
      }
    });
  }

  filterAppointments(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';

    this.filteredAppointments = this.appointments.filter(appointment => {
      const patientName = `${appointment.patient.person.first_name} ${appointment.patient.person.last_name}`.toLowerCase();
      return patientName.includes(searchTerm);
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(date: string): string {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  getPatientAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  getGenderText(gender: string): string {
    switch (gender) {
      case '1':
        return 'Masculino';
      case '2':
        return 'Femenino';
      default:
        return 'Otro';
    }
  }

  openTreatmentModal(appointment: PendingAppointmentResponse) {
    this.selectedAppointment = appointment;
    this.showTreatmentModal = true;
    this.treatmentForm.reset();
    this.cdr.markForCheck();
  }

  closeTreatmentModal() {
    this.showTreatmentModal = false;
    this.selectedAppointment = null;
    this.cdr.markForCheck();
  }

  saveTreatment() {
    if (this.treatmentForm.invalid) {
      this.treatmentForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const treatment = this.treatmentForm.get('treatmentText')?.value;
    console.log('Tratamiento guardado:', treatment);
    console.log('Para paciente:', this.selectedAppointment?.patient.person.first_name);

    this.closeTreatmentModal();
  }

  cancelAppointment(appointment: PendingAppointmentResponse) {
    console.log('Cita cancelada:', appointment);
  }

  trackByAppointmentId(index: number, appointment: PendingAppointmentResponse): number {
    return appointment.id;
  }

  protected readonly Search = Search;
  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly FileText = FileText;
  protected readonly CheckCircle2 = CheckCircle2;
  protected readonly XCircle = XCircle;
  protected readonly AlertCircle = AlertCircle;
  protected readonly X = X;
}