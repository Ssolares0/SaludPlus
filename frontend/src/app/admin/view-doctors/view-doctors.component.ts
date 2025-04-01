import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Search,
  Phone,
  Building,
  UserX,
  Circle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  User2
} from 'lucide-angular';
import { AdminService } from '../services/admin.service';
import { ActiveDoctorsResponse } from '../models/admin.models';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-view-doctors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, SafeImagePipe, ModalComponent],
  templateUrl: './view-doctors.component.html',
  styleUrls: ['./view-doctors.component.css']
})
export class ViewDoctorsComponent implements OnInit {
  doctors: ActiveDoctorsResponse[] = [];
  filteredDoctors: ActiveDoctorsResponse[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  selectedSpecialty: string = 'all';

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  modalVisible: boolean = false;
  modalType: 'success' | 'warning' | 'error' = 'warning';
  modalTitle: string = '';
  modalMessage: string = '';
  modalShowConfirmButton: boolean = false;
  selectedDoctor: ActiveDoctorsResponse | null = null;
  processingDoctor: { id: number, name: string } | null = null;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.fetchActiveDoctors();
  }

  fetchActiveDoctors(): void {
    this.loading = true;
    this.adminService.getActiveDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filteredDoctors = [...this.doctors];
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

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  filterDoctors(): void {
    let filtered = [...this.doctors];

    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(doctor =>
        `${doctor.firstame} ${doctor.lastName}`.toLowerCase().includes(searchTermLower) ||
        doctor.specialty.some(s => s.specialty.name.toLowerCase().includes(searchTermLower))
      );
    }

    if (this.selectedSpecialty !== 'all') {
      filtered = filtered.filter(doctor =>
        doctor.specialty.some(s => s.specialty.name === this.selectedSpecialty)
      );
    }

    this.filteredDoctors = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.itemsPerPage);
  }

  getCurrentPageItems(): ActiveDoctorsResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDoctors.slice(startIndex, endIndex);
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

  getUniqueSpecialties(): string[] {
    const specialties = new Set<string>();
    this.doctors.forEach(doctor => {
      doctor.specialty.forEach(s => {
        specialties.add(s.specialty.name);
      });
    });
    return Array.from(specialties);
  }

  confirmDeactivateDoctor(doctor: ActiveDoctorsResponse): void {
    this.selectedDoctor = doctor;
    this.showConfirmModal(
      'warning',
      'Confirmar Dar de Baja',
      `¿Estás seguro de dar de baja al Dr. ${doctor.firstame} ${doctor.lastName}? Esta acción no se puede deshacer.`
    );
  }

  onConfirmAction(): void {
    if (!this.selectedDoctor) return;

    const doctor = this.selectedDoctor;
    this.processingDoctor = {
      id: doctor.id,
      name: `${doctor.firstame} ${doctor.lastName}`
    };

    this.processDeactivateDoctor(doctor);
    this.closeModal();
  }

  private processDeactivateDoctor(doctor: ActiveDoctorsResponse): void {
    this.adminService.rejectUser(doctor.id).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.showModal(
            'success',
            'Médico Dado de Baja',
            `Se ha dado de baja correctamente al Dr. ${doctor.firstame} ${doctor.lastName}.`
          );
          this.removeDoctorFromLists(doctor.id);
        } else {
          this.showModal(
            'warning',
            'Estado Incierto',
            'La acción se completó pero el servidor respondió con un estado incierto. Por favor, verifica si el médico fue dado de baja.'
          );
        }
        this.processingDoctor = null;
      },
      error: (error) => {
        console.error('Error al dar de baja al médico:', error);
        this.showModal(
          'error',
          'Error al Dar de Baja',
          `No se pudo dar de baja al Dr. ${doctor.firstame} ${doctor.lastName}. Por favor, inténtalo de nuevo más tarde.`
        );
        this.processingDoctor = null;
      }
    });
  }

  private removeDoctorFromLists(doctorId: number): void {
    this.doctors = this.doctors.filter(d => d.id !== doctorId);
    this.filteredDoctors = this.filteredDoctors.filter(d => d.id !== doctorId);
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
      this.selectedDoctor = null;
    }
  }

  isProcessingDoctor(doctorId: number): boolean {
    return this.processingDoctor?.id === doctorId;
  }

  protected readonly Search = Search;
  protected readonly Phone = Phone;
  protected readonly Building = Building;
  protected readonly UserX = UserX;
  protected readonly Circle = Circle;
  protected readonly FileText = FileText;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly Calendar = Calendar;
  protected readonly CreditCard = CreditCard;
  protected readonly User2 = User2;
}