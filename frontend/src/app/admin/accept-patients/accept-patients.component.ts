import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Calendar, User, Mail, Check, X, UserX } from 'lucide-angular';
import { AdminService } from '../services/admin.service';
import { PendingPatientsResponse, AcceptUserResponse, RejectUserResponse } from '../models/admin.models';
import { FormsModule } from '@angular/forms';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-accept-patients',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    SafeImagePipe,
    ModalComponent
  ],
  templateUrl: './accept-patients.component.html',
  styleUrls: ['./accept-patients.component.css']
})

export class AcceptPatientsComponent implements OnInit {
  isLoading: boolean = true;
  pendingPatients: PendingPatientsResponse[] = [];
  searchTerm: string = '';
  filteredPatients: PendingPatientsResponse[] = [];
  errorMessage: string | null = null;

  modalVisible: boolean = false;
  modalType: 'success' | 'warning' | 'error' = 'success';
  modalTitle: string = '';
  modalMessage: string = '';
  modalShowConfirmButton: boolean = false;
  modalAction: 'accept' | 'reject' | null = null;

  selectedPatient: PendingPatientsResponse | null = null;
  processingPatient: { id: number, name: string } | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPendingPatients();
  }

  loadPendingPatients(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getPendingPatients().subscribe({
      next: (patients) => {
        this.pendingPatients = patients;
        this.filteredPatients = patients;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error al cargar pacientes pendientes:', error);
        this.errorMessage = 'No se pudieron cargar las solicitudes de pacientes. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  confirmAcceptPatient(patient: PendingPatientsResponse): void {
    this.selectedPatient = patient;
    this.modalAction = 'accept';

    this.showConfirmModal(
      'warning',
      'Confirmar Aceptación',
      `¿Estás seguro de aceptar al paciente ${patient.firstame} ${patient.lastName}?`
    );
  }

  confirmRejectPatient(patient: PendingPatientsResponse): void {
    this.selectedPatient = patient;
    this.modalAction = 'reject';

    this.showConfirmModal(
      'warning',
      'Confirmar Rechazo',
      `¿Estás seguro de rechazar al paciente ${patient.firstame} ${patient.lastName}? Esta acción no se puede deshacer.`
    );
  }

  onConfirmAction(): void {
    if (!this.selectedPatient) return;

    const patient = this.selectedPatient;

    this.processingPatient = {
      id: patient.id,
      name: `${patient.firstame} ${patient.lastName}`
    };

    if (this.modalAction === 'accept') {
      this.processAcceptPatient(patient);
    } else if (this.modalAction === 'reject') {
      this.processRejectPatient(patient);
    }

    this.closeModal();
  }

  private processAcceptPatient(patient: PendingPatientsResponse): void {
    this.adminService.acceptUser(patient.id).subscribe({
      next: (response: AcceptUserResponse) => {
        if (response && response.success) {
          this.showModal(
            'success',
            'Paciente Aceptado',
            `Se ha aceptado correctamente la solicitud de ${patient.firstame} ${patient.lastName}.`
          );
          this.removePatientFromLists(patient.id);
        } else {
          this.showModal(
            'warning',
            'Estado Incierto',
            'La acción se completó pero el servidor respondió con un estado incierto. Por favor, verifica si el paciente fue aceptado.'
          );
        }
        this.processingPatient = null;
      },
      error: (error: Error) => {
        console.error('Error al aceptar paciente:', error);
        this.showModal(
          'error',
          'Error al Aceptar Paciente',
          `No se pudo aceptar al paciente ${patient.firstame} ${patient.lastName}. Por favor, inténtalo de nuevo más tarde.`
        );
        this.processingPatient = null;
      }
    });
  }

  private processRejectPatient(patient: PendingPatientsResponse): void {
    this.adminService.rejectUser(patient.id).subscribe({
      next: (response: RejectUserResponse) => {
        if (response && response.success) {
          this.showModal(
            'success',
            'Paciente Rechazado',
            `Se ha rechazado correctamente la solicitud de ${patient.firstame} ${patient.lastName}.`
          );
          this.removePatientFromLists(patient.id);
        } else {
          this.showModal(
            'warning',
            'Estado Incierto',
            'La acción se completó pero el servidor respondió con un estado incierto. Por favor, verifica si el paciente fue rechazado.'
          );
        }
        this.processingPatient = null;
      },
      error: (error: Error) => {
        console.error('Error al rechazar paciente:', error);
        this.showModal(
          'error',
          'Error al Rechazar Paciente',
          `No se pudo rechazar al paciente ${patient.firstame} ${patient.lastName}. Por favor, inténtalo de nuevo más tarde.`
        );
        this.processingPatient = null;
      }
    });
  }

  private removePatientFromLists(patientId: number): void {
    this.pendingPatients = this.pendingPatients.filter(p => p.id !== patientId);
    this.filteredPatients = this.filteredPatients.filter(p => p.id !== patientId);
  }

  handleImageError(event: any, patient: PendingPatientsResponse): void {
    event.target.src = '';
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  isValidImageUrl(url: string | null): boolean {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  searchPatients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = this.pendingPatients;
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPatients = this.pendingPatients.filter(patient =>
      patient.firstame.toLowerCase().includes(term) ||
      patient.lastName.toLowerCase().includes(term)
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getGenderText(gender: string): string {
    return gender === '1' ? 'Masculino' :
      gender === '2' ? 'Femenino' : 'Otro';
  }

  showConfirmModal(type: 'success' | 'warning' | 'error', title: string, message: string): void {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalShowConfirmButton = true;
    this.modalVisible = true;
  }

  showModal(type: 'success' | 'warning' | 'error', title: string, message: string): void {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalShowConfirmButton = false;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
    if (this.modalShowConfirmButton) {
      this.selectedPatient = null;
      this.modalAction = null;
    }
  }

  isProcessingPatient(patientId: number): boolean {
    return this.processingPatient?.id === patientId;
  }

  protected readonly Search = Search;
  protected readonly Calendar = Calendar;
  protected readonly User = User;
  protected readonly Mail = Mail;
  protected readonly Check = Check;
  protected readonly X = X;
  protected readonly UserX = UserX;
}