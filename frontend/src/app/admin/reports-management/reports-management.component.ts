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
  DoctorReportResponse,
  UnifiedReportType 
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

  patientReports: PatientReportResponse[] = [];
  doctorReports: DoctorReportResponse[] = [];
  allReports: UnifiedReportType[] = [];
  filteredReports: UnifiedReportType[] = [];
  
  isLoading = true;
  errorMessage = '';
  activeTab: 'pending' | 'resolved' = 'pending';
  
  searchTerm = '';
  selectedCategory = 'all';
  selectedUserType = 'all';
  availableCategories: string[] = [];

  modalVisible = false;
  modalType: 'success' | 'warning' | 'error' = 'warning';
  modalTitle = '';
  modalMessage = '';
  modalShowConfirmButton = true;
  currentAction: 'resolve' | 'dismiss' | 'ban' | null = null;
  selectedReport: UnifiedReportType | null = null;

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

        this.processReports();
        
        this.extractCategories();
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.errorMessage = 'No se pudieron cargar los reportes. Intente nuevamente.';
        this.isLoading = false;
      }
    });
  }

  processReports(): void {
    const patientReportsUnified: UnifiedReportType[] = this.patientReports.map(report => ({
      ...report,
      status: this.getRandomStatus() 
    }));

    const doctorReportsUnified: UnifiedReportType[] = this.doctorReports.map(report => ({
      ...report,
      status: this.getRandomStatus()
    }));

    this.allReports = [...patientReportsUnified, ...doctorReportsUnified];

    this.applyFilters();
  }

  getRandomStatus(): 'pending' | 'resolved' {
    return Math.random() > 0.3 ? 'pending' : 'resolved';
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

  setActiveTab(tab: 'pending' | 'resolved'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allReports];
    
    filtered = filtered.filter(report => report.status === this.activeTab);
    
    if (this.selectedUserType !== 'all') {
      filtered = filtered.filter(report => {
        if (this.selectedUserType === 'doctor') {
          return report.reportedRole_name === 'doctor';
        } else {
          return report.reportedRole_name === 'paciente';
        }
      });
    }
    
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(report => 
        report.reports_category === this.selectedCategory
      );
    }
    
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

  getPendingReportsCount(): number {
    return this.allReports.filter(report => report.status === 'pending').length;
  }

  confirmResolveReport(report: UnifiedReportType): void {
    this.selectedReport = report;
    this.currentAction = 'resolve';
    this.modalType = 'warning';
    this.modalTitle = 'Confirmar acción';
    this.modalMessage = `¿Está seguro que desea marcar como resuelto el reporte sobre ${report.reported_name}?`;
    this.modalShowConfirmButton = true;
    this.modalVisible = true;
  }

  confirmDismissReport(report: UnifiedReportType): void {
    this.selectedReport = report;
    this.currentAction = 'dismiss';
    this.modalType = 'warning';
    this.modalTitle = 'Confirmar acción';
    this.modalMessage = `¿Está seguro que desea descartar el reporte sobre ${report.reported_name}?`;
    this.modalShowConfirmButton = true;
    this.modalVisible = true;
  }

  confirmBanUser(report: UnifiedReportType): void {
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

    setTimeout(() => {
      switch (this.currentAction) {
        case 'resolve':
          this.resolveReport(this.selectedReport!);
          break;
        case 'dismiss':
          this.dismissReport(this.selectedReport!);
          break;
        case 'ban':
          this.banUser(this.selectedReport!);
          break;
      }

      this.closeModal();
    }, 500);
  }

  resolveReport(report: UnifiedReportType): void {
    const index = this.allReports.findIndex(r => r.reports_id === report.reports_id);
    if (index !== -1) {
      this.allReports[index] = { ...report, status: 'resolved' };
      this.showSuccessModal('Reporte marcado como resuelto exitosamente.');
    }
    this.applyFilters();
  }

  dismissReport(report: UnifiedReportType): void {
    const index = this.allReports.findIndex(r => r.reports_id === report.reports_id);
    if (index !== -1) {
      this.allReports[index] = { ...report, status: 'resolved' };
      this.showSuccessModal('Reporte descartado exitosamente.');
    }
    this.applyFilters();
  }

  banUser(report: UnifiedReportType): void {
    const index = this.allReports.findIndex(r => r.reports_id === report.reports_id);
    if (index !== -1) {
      this.allReports[index] = { ...report, status: 'resolved' };
      this.showSuccessModal(`Usuario ${report.reported_name} suspendido exitosamente.`);
    }
    this.applyFilters();
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
}