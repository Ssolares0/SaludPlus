import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  UserX,
  Circle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-angular';
import { AdminService } from '../services/admin.service';
import { ActivePatientsResponse } from '../models/admin.models';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-view-patients',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ModalComponent],
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css']
})

export class ViewPatientsComponent implements OnInit {
  protected readonly Search = Search;
  protected readonly UserX = UserX;
  protected readonly Circle = Circle;
  protected readonly ChevronRight = ChevronRight;
  protected readonly ChevronLeft = ChevronLeft;

  patients: ActivePatientsResponse[] = [];
  filteredPatients: ActivePatientsResponse[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  modalVisible: boolean = false;
  modalType: 'success' | 'warning' | 'error' = 'warning';
  modalTitle: string = '';
  modalMessage: string = '';
  modalShowConfirmButton: boolean = false;
  selectedPatient: ActivePatientsResponse | null = null;
  processingPatient: { id: number, name: string } | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchActivePatients();
  }

  fetchActivePatients(): void {
    this.loading = true;
    this.adminService.getActivePatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = [...this.patients];
        this.updatePagination();
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  searchPatients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPatients = [...this.patients];
    } else {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      this.filteredPatients = this.patients.filter(patient => 
        `${patient.firstame} ${patient.lastName}`.toLowerCase().includes(searchTermLower)
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredPatients.length / this.itemsPerPage);
  }

  getCurrentPageItems(): ActivePatientsResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPatients.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  confirmRejectPatient(patient: ActivePatientsResponse): void {
    this.selectedPatient = patient;
    this.showConfirmModal(
      'warning',
      'Confirmar Dar de Baja',
      `¿Estás seguro de dar de baja al paciente ${patient.firstame} ${patient.lastName}? Esta acción no se puede deshacer.`
    );
  }

  onConfirmAction(): void {
    if (!this.selectedPatient) return;

    const patient = this.selectedPatient;
    this.processingPatient = {
      id: patient.id,
      name: `${patient.firstame} ${patient.lastName}`
    };

    this.processRejectPatient(patient);
    this.closeModal();
  }

  private processRejectPatient(patient: ActivePatientsResponse): void {
    this.adminService.rejectUser(patient.id).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.showModal(
            'success',
            'Paciente Dado de Baja',
            `Se ha dado de baja correctamente al paciente ${patient.firstame} ${patient.lastName}.`
          );
          this.removePatientFromLists(patient.id);
        } else {
          this.showModal(
            'warning',
            'Estado Incierto',
            'La acción se completó pero el servidor respondió con un estado incierto. Por favor, verifica si el paciente fue dado de baja.'
          );
        }
        this.processingPatient = null;
      },
      error: (error) => {
        console.error('Error al dar de baja al paciente:', error);
        this.showModal(
          'error',
          'Error al Dar de Baja',
          `No se pudo dar de baja al paciente ${patient.firstame} ${patient.lastName}. Por favor, inténtalo de nuevo más tarde.`
        );
        this.processingPatient = null;
      }
    });
  }

  private removePatientFromLists(patientId: number): void {
    this.patients = this.patients.filter(p => p.id !== patientId);
    this.filteredPatients = this.filteredPatients.filter(p => p.id !== patientId);
    this.updatePagination();
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
    }
  }

  isProcessingPatient(patientId: number): boolean {
    return this.processingPatient?.id === patientId;
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
  
  getGenderClass(gender: string): string {
    switch (gender) {
      case '1':
        return 'male';
      case '2':
        return 'female';
      default:
        return 'other';
    }
  }
}