import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Award, Building, Phone, FileText, Check, X, User, UserX } from 'lucide-angular';
import { AdminService } from '../services/admin.service';
import { PendingDoctorsResponse } from '../models/admin.models';
import { FormsModule } from '@angular/forms';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-accept-doctors',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule,
    SafeImagePipe,
    ModalComponent
  ],
  templateUrl: './accept-doctors.component.html',
  styleUrls: ['./accept-doctors.component.css']
})

export class AcceptDoctorsComponent implements OnInit {
  isLoading: boolean = true;
  pendingDoctors: PendingDoctorsResponse[] = [];
  filteredDoctors: PendingDoctorsResponse[] = [];
  searchTerm: string = '';
  selectedSpecialty: string = 'all';
  errorMessage: string | null = null;

  modalVisible: boolean = false;
  modalType: 'success' | 'warning' | 'error' = 'success';
  modalTitle: string = '';
  modalMessage: string = '';
  modalShowConfirmButton: boolean = false;
  modalAction: 'accept' | 'reject' | null = null;

  selectedDoctor: PendingDoctorsResponse | null = null;
  processingDoctor: { id: number, name: string } | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadPendingDoctors();
  }

  loadPendingDoctors(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.adminService.getPendingDoctors().subscribe({
      next: (doctors) => {
        console.log('Médicos pendientes:', doctors);
        this.pendingDoctors = doctors;
        this.filteredDoctors = doctors;
        this.isLoading = false;
      },
      error: (error: Error) => {
        console.error('Error al cargar médicos pendientes:', error);
        this.errorMessage = 'No se pudieron cargar las solicitudes de médicos. Por favor, intenta de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  searchDoctors(): void {
    if (!this.searchTerm.trim() && this.selectedSpecialty === 'all') {
      this.filteredDoctors = this.pendingDoctors;
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDoctors = this.pendingDoctors.filter(doctor => {
      const matchesSearch = !term ||
        doctor.firstame.toLowerCase().includes(term) ||
        doctor.lastName.toLowerCase().includes(term) ||
        doctor.dpi.includes(term);

      const matchesSpecialty = this.selectedSpecialty === 'all' ||
        doctor.specialty.some(s => s.specialty.name.toLowerCase() === this.selectedSpecialty);

      return matchesSearch && matchesSpecialty;
    });
  }

  confirmAcceptDoctor(doctor: PendingDoctorsResponse): void {
    this.selectedDoctor = doctor;
    this.modalAction = 'accept';
    this.showConfirmModal(
      'warning',
      'Confirmar Aceptación',
      `¿Estás seguro de aceptar al Dr. ${doctor.firstame} ${doctor.lastName}?`
    );
  }

  confirmRejectDoctor(doctor: PendingDoctorsResponse): void {
    this.selectedDoctor = doctor;
    this.modalAction = 'reject';
    this.showConfirmModal(
      'warning',
      'Confirmar Rechazo',
      `¿Estás seguro de rechazar al Dr. ${doctor.firstame} ${doctor.lastName}? Esta acción no se puede deshacer.`
    );
  }

  onConfirmAction(): void {
    if (!this.selectedDoctor) return;

    const doctor = this.selectedDoctor;

    this.processingDoctor = {
      id: doctor.id,
      name: `${doctor.firstame} ${doctor.lastName}`
    };

    if (this.modalAction === 'accept') {
      this.processAcceptDoctor(doctor);
    } else if (this.modalAction === 'reject') {
      this.processRejectDoctor(doctor);
    }

    this.closeModal();
  }

  private processAcceptDoctor(doctor: PendingDoctorsResponse): void {
    console.log('Procesando aceptación del doctor:', doctor.id);

    this.adminService.acceptUser(doctor.id).subscribe({
      next: (response) => {
        console.log('Respuesta de aceptación:', response);
        if (response && response.success) {
          this.showModal(
            'success',
            'Doctor Aceptado',
            `Se ha aceptado correctamente la solicitud del Dr. ${doctor.firstame} ${doctor.lastName}.`
          );
          this.removeDoctorFromLists(doctor.id);
        } else {
          this.showModal(
            'warning',
            'Estado Incierto',
            'La acción se completó pero el servidor respondió con un estado incierto. Por favor, verifica si el doctor fue aceptado.'
          );
        }
        this.processingDoctor = null;
      },
      error: (error: Error) => {
        console.error('Error al aceptar doctor:', error);
        this.showModal(
          'error',
          'Error al Aceptar Doctor',
          `No se pudo aceptar al Dr. ${doctor.firstame} ${doctor.lastName}. Por favor, inténtalo de nuevo más tarde.`
        );
        this.processingDoctor = null;
      }
    });
  }

  private processRejectDoctor(doctor: PendingDoctorsResponse): void {
    console.log('Procesando rechazo del doctor:', doctor.id);

    this.adminService.rejectUser(doctor.id).subscribe({
      next: (response) => {
        console.log('Respuesta de rechazo:', response);
        if (response && response.success) {
          this.showModal(
            'success',
            'Doctor Rechazado',
            `Se ha rechazado correctamente la solicitud del Dr. ${doctor.firstame} ${doctor.lastName}.`
          );
          this.removeDoctorFromLists(doctor.id);
        } else {
          this.showModal(
            'warning',
            'Estado Incierto',
            'La acción se completó pero el servidor respondió con un estado incierto. Por favor, verifica si el doctor fue rechazado.'
          );
        }
        this.processingDoctor = null;
      },
      error: (error: Error) => {
        console.error('Error al rechazar doctor:', error);
        this.showModal(
          'error',
          'Error al Rechazar Doctor',
          `No se pudo rechazar al Dr. ${doctor.firstame} ${doctor.lastName}. Por favor, inténtalo de nuevo más tarde.`
        );
        this.processingDoctor = null;
      }
    });
  }

  private removeDoctorFromLists(doctorId: number): void {
    this.pendingDoctors = this.pendingDoctors.filter(d => d.id !== doctorId);
    this.filteredDoctors = this.filteredDoctors.filter(d => d.id !== doctorId);
  }

  getSpecialtiesText(doctor: PendingDoctorsResponse): string {
    return doctor.specialty.map(s => s.specialty.name).join(', ');
  }

  getDepartmentsText(doctor: PendingDoctorsResponse): string {
    return doctor.department.map(d => `${d.department.name} - ${d.department.location}`).join(', ');
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
      this.selectedDoctor = null;
      this.modalAction = null;
    }
  }

  isProcessingDoctor(doctorId: number): boolean {
    return this.processingDoctor?.id === doctorId;
  }

  protected readonly Search = Search;
  protected readonly Award = Award;
  protected readonly Building = Building;
  protected readonly Phone = Phone;
  protected readonly FileText = FileText;
  protected readonly Check = Check;
  protected readonly X = X;
  protected readonly User = User;
  protected readonly UserX = UserX;
}