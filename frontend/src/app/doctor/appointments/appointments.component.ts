import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Calendar, Clock, FileText, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-angular';
import { DoctorService } from '../services/doctor.service';
import { PendingAppointmentResponse } from '../models/doctor.model';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, SafeImagePipe, ModalComponent],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsComponent implements OnInit {
  searchControl = new FormControl('');
  treatmentForm!: FormGroup;
  cancelForm!: FormGroup;

  appointments: PendingAppointmentResponse[] = [];
  filteredAppointments: PendingAppointmentResponse[] = [];

  isSavingTreatment: boolean = false;
  isCancelingAppointment: boolean = false;

  showTreatmentModal = false;
  showCancelModal = false;
  selectedAppointment: PendingAppointmentResponse | null = null;
  loading = true;
  error: string | null = null;
  processingAppointment: { id: number, action: 'complete' | 'cancel' } | null = null;

  modalVisible: boolean = false;
  modalType: 'success' | 'warning' | 'error' = 'success';
  modalTitle: string = '';
  modalMessage: string = '';
  modalShowConfirmButton: boolean = false;
  modalAction: 'complete' | 'cancel' | null = null;

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

    this.cancelForm = new FormGroup({
      reason: new FormControl('', [Validators.required, Validators.minLength(10)]),
      apology: new FormControl('', [Validators.required, Validators.minLength(10)])
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

  openTreatmentModal(appointment: PendingAppointmentResponse) {
    this.selectedAppointment = appointment;
    this.showTreatmentModal = true;
    this.treatmentForm.reset();
    this.cdr.markForCheck();
  }

  openCancelModal(appointment: PendingAppointmentResponse) {
    this.selectedAppointment = appointment;
    this.modalAction = 'cancel';

    this.showConfirmModal(
      'warning',
      'Confirmar Cancelación',
      `¿Estás seguro de cancelar la cita del paciente ${appointment.patient.person.first_name} ${appointment.patient.person.last_name}?`
    );
  }

  closeTreatmentModal() {
    this.showTreatmentModal = false;
    this.selectedAppointment = null;
    this.treatmentForm.reset();
    this.cdr.markForCheck();
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.selectedAppointment = null;
    this.cancelForm.reset();
    this.cdr.markForCheck();
  }

  completeAppointment() {
    if (this.treatmentForm.invalid || !this.selectedAppointment) {
      this.treatmentForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const doctorId = Number(localStorage.getItem('doctorId'));
    if (!doctorId) {
      console.error('Doctor ID not found');
      return;
    }

    this.isSavingTreatment = true;
    this.cdr.markForCheck();

    this.processingAppointment = {
      id: this.selectedAppointment.id,
      action: 'complete'
    };

    const body = {
      treatment: this.treatmentForm.get('treatmentText')?.value,
      doctor_id: doctorId
    };

    this.doctorService.acceptAppointment(this.selectedAppointment.id, body).subscribe({
      next: (response) => {
        this.isSavingTreatment = false;
        this.showModal(
          'success',
          'Cita Completada',
          `Se ha completado exitosamente la cita del paciente ${this.selectedAppointment?.patient.person.first_name} ${this.selectedAppointment?.patient.person.last_name}.`
        );
        this.removeAppointmentFromList(this.selectedAppointment!.id);
        this.closeTreatmentModal();
        this.processingAppointment = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isSavingTreatment = false;
        this.showModal(
          'error',
          'Error al Completar la Cita',
          'Ha ocurrido un error al intentar completar la cita. Por favor, intente nuevamente.'
        );
        console.error('Error completing appointment:', error);
        this.processingAppointment = null;
        this.cdr.markForCheck();
      }
    });
  }

  onConfirmAction(): void {
    if (!this.selectedAppointment) return;

    if (this.modalAction === 'cancel') {
      this.showCancelModal = true;
      this.modalVisible = false;
      this.cdr.markForCheck();
    }
  }

  cancelAppointment() {
    if (this.cancelForm.invalid || !this.selectedAppointment) {
      this.cancelForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const doctorId = Number(localStorage.getItem('doctorId'));
    if (!doctorId) {
      console.error('Doctor ID not found');
      return;
    }

    this.isCancelingAppointment = true;
    this.cdr.markForCheck();

    this.processingAppointment = {
      id: this.selectedAppointment.id,
      action: 'cancel'
    };

    const body = {
      reason: this.cancelForm.get('reason')?.value,
      apology: this.cancelForm.get('apology')?.value,
      doctor_id: doctorId
    };

    this.doctorService.cancelAppointment(this.selectedAppointment.id, body).subscribe({
      next: (response) => {
        this.isCancelingAppointment = false; 
        this.showModal(
          'success',
          'Cita Cancelada',
          `Se ha cancelado exitosamente la cita del paciente ${this.selectedAppointment?.patient.person.first_name} ${this.selectedAppointment?.patient.person.last_name}.`
        );
        this.removeAppointmentFromList(this.selectedAppointment!.id);
        this.closeCancelModal();
        this.processingAppointment = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.isCancelingAppointment = false;
        this.showModal(
          'error',
          'Error al Cancelar la Cita',
          'Ha ocurrido un error al intentar cancelar la cita. Por favor, intente nuevamente.'
        );
        console.error('Error canceling appointment:', error);
        this.processingAppointment = null;
        this.cdr.markForCheck();
      }
    });
  }

  private removeAppointmentFromList(appointmentId: number) {
    this.appointments = this.appointments.filter(a => a.id !== appointmentId);
    this.filteredAppointments = this.filteredAppointments.filter(a => a.id !== appointmentId);
  }

  isProcessingAppointment(appointmentId: number, action: 'complete' | 'cancel'): boolean {
    return this.processingAppointment?.id === appointmentId &&
      this.processingAppointment?.action === action;
  }

  showConfirmModal(type: 'success' | 'warning' | 'error', title: string, message: string): void {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalShowConfirmButton = true;
    this.modalVisible = true;
    this.cdr.markForCheck();
  }

  showModal(type: 'success' | 'warning' | 'error', title: string, message: string): void {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalShowConfirmButton = false;
    this.modalVisible = true;
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.modalVisible = false;
    if (this.modalShowConfirmButton) {
      this.selectedAppointment = null;
      this.modalAction = null;
    }
    this.cdr.markForCheck();
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