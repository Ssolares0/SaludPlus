import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  LucideAngularModule, Search, AlertTriangle, User, Users, 
  Calendar, CheckCircle, XCircle, ClipboardList, 
  FilterX, UserX 
} from 'lucide-angular';
import { AdminService } from '../services/admin.service';
import { 
  PatientReportResponse, 
  DoctorReportResponse
} from '../models/admin.models';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reports-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LucideAngularModule,
    ModalComponent
  ],
  templateUrl: './reports-management.component.html',
  styleUrls: ['./reports-management.component.css']
})
export class ReportsManagementComponent implements OnInit {
  // Icons
  protected readonly Search = Search;
  protected readonly AlertTriangle = AlertTriangle;
  protected readonly User = User;
  protected readonly Users = Users;
  protected readonly Calendar = Calendar;
  protected readonly CheckCircle = CheckCircle;
  protected readonly XCircle = XCircle;
  protected readonly ClipboardList = ClipboardList;
  protected readonly FilterX = FilterX;
  protected readonly UserX = UserX;

  // Reports data
  patientReports: PatientReportResponse[] = [];
  doctorReports: DoctorReportResponse[] = [];
  allReports: (PatientReportResponse | DoctorReportResponse)[] = [];
  filteredReports: (PatientReportResponse | DoctorReportResponse)[] = [];
  
  // UI state
  isLoading = true;
  errorMessage = '';
  
  // Filters
  searchTerm = '';
  selectedCategory = 'all';
  selectedUserType = 'all';
  availableCategories: string[] = [];

  // Modal state
  modalVisible = false;
  modalType: 'success' | 'warning' | 'error' = 'warning';
  modalTitle = '';
  modalMessage = '';
  modalShowConfirmButton = true;
  currentAction: 'resolve' | 'ban' | null = null;
  selectedReport: (PatientReportResponse | DoctorReportResponse) | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      patients: this.adminService.getPatientsReport(),
      doctors: this.adminService.getDoctorsReport()
    }).subscribe({
      next: (results) => {
        this.patientReports = results.patients || [];
        this.doctorReports = results.doctors || [];

        // Combine all reports
        this.allReports = [...this.patientReports, ...this.doctorReports];
        
        // Extract unique categories for filtering
        this.extractCategories();
        
        // Apply initial filters
        this.applyFilters();
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.errorMessage = 'No se pudieron cargar los reportes. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  extractCategories(): void {
    const categories = new Set<string>();
    
    this.allReports.forEach(report => {
      if (report.reports_category) {
        categories.add(report.reports_category);
      }
    });
    
    this.availableCategories = Array.from(categories);
  }

  applyFilters(): void {
    let filtered = [...this.allReports];
    
    // Filter by user type
    if (this.selectedUserType !== 'all') {
      filtered = filtered.filter(report => {
        if (this.selectedUserType === 'doctor') {
          return report.reportedRole_name === 'doctor';
        } else {
          return report.reportedRole_name === 'paciente';
        }
      });
    }
    
    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(report => 
        report.reports_category === this.selectedCategory
      );
    }
    
    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(report => 
        report.reported_name.toLowerCase().includes(term) ||
        report.reporter_name.toLowerCase().includes(term) ||
        report.reports_description.toLowerCase().includes(term)
      );
    }
    
    this.filteredReports = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.selectedUserType = 'all';
    this.applyFilters();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  getUserRoleLabel(role: string): string {
    switch (role) {
      case 'doctor': return 'Médico';
      case 'paciente': return 'Paciente';
      default: return role;
    }
  }

  // Action handlers
  confirmResolveReport(report: PatientReportResponse | DoctorReportResponse): void {
    this.selectedReport = report;
    this.currentAction = 'resolve';
    this.modalType = 'warning';
    this.modalTitle = 'Confirmar acción';
    this.modalMessage = `¿Está seguro que desea marcar como resuelto el reporte sobre ${report.reported_name}? Esta acción eliminará el reporte permanentemente.`;
    this.modalShowConfirmButton = true;
    this.modalVisible = true;
  }

  confirmBanUser(report: PatientReportResponse | DoctorReportResponse): void {
    this.selectedReport = report;
    this.currentAction = 'ban';
    this.modalType = 'error';
    this.modalTitle = 'Confirmar suspensión';
    this.modalMessage = `¿Está seguro que desea suspender al usuario ${report.reported_name}? Esta acción es irreversible.`;
    this.modalShowConfirmButton = true;
    this.modalVisible = true;
  }

  onConfirmAction(): void {
    if (!this.selectedReport || !this.currentAction) {
      this.closeModal();
      return;
    }

    this.isLoading = true;

    switch (this.currentAction) {
      case 'resolve':
        this.resolveReport(this.selectedReport);
        break;
      case 'ban':
        this.banUser(this.selectedReport);
        break;
    }
  }

  resolveReport(report: PatientReportResponse | DoctorReportResponse): void {
    if (!report.reports_id) {
      this.showErrorModal('No se pudo identificar el ID del reporte.');
      this.isLoading = false;
      return;
    }

    // Usar el servicio para marcar como resuelto (eliminar) el reporte
    this.adminService.confirmReport(report.reports_id).subscribe({
      next: () => {
        this.isLoading = false;
        // Eliminar el reporte del arreglo local
        this.allReports = this.allReports.filter(r => r.reports_id !== report.reports_id);
        this.applyFilters();
        this.showSuccessModal('Reporte marcado como resuelto exitosamente.');
      },
      error: (err) => {
        console.error('Error al resolver el reporte:', err);
        this.isLoading = false;
        this.showErrorModal('No se pudo marcar el reporte como resuelto. Por favor, intente nuevamente.');
      }
    });

    this.closeModal();
  }

  banUser(report: PatientReportResponse | DoctorReportResponse): void {
    // Primero intentar obtener el ID del usuario a suspender
    const userId = this.getUserId(report);
    
    if (!userId) {
      this.showErrorModal('No se pudo identificar el ID del usuario para suspender.');
      this.isLoading = false;
      return;
    }

    // Usar el servicio para suspender al usuario
    this.adminService.rejectUser(userId).subscribe({
      next: () => {
        this.isLoading = false;
        // Eliminar también el reporte
        if (report.reports_id) {
          this.adminService.confirmReport(report.reports_id).subscribe({
            next: () => {
              this.allReports = this.allReports.filter(r => r.reports_id !== report.reports_id);
              this.applyFilters();
            },
            error: (err) => console.error('Error al eliminar el reporte tras suspensión:', err)
          });
        }
        this.showSuccessModal(`Usuario ${report.reported_name} suspendido exitosamente.`);
      },
      error: (err) => {
        console.error('Error al suspender al usuario:', err);
        this.isLoading = false;
        this.showErrorModal('No se pudo suspender al usuario. Por favor, intente nuevamente.');
      }
    });

    this.closeModal();
  }

  private getUserId(report: PatientReportResponse | DoctorReportResponse): number | null {
    return report.reported_id || null;
  }

  closeModal(): void {
    this.modalVisible = false;
    this.selectedReport = null;
    this.currentAction = null;
  }

  showSuccessModal(message: string): void {
    this.modalType = 'success';
    this.modalTitle = '¡Acción completada!';
    this.modalMessage = message;
    this.modalShowConfirmButton = false;
    this.modalVisible = true;
  }

  showErrorModal(message: string): void {
    this.modalType = 'error';
    this.modalTitle = 'Error';
    this.modalMessage = message;
    this.modalShowConfirmButton = false;
    this.modalVisible = true;
  }
}