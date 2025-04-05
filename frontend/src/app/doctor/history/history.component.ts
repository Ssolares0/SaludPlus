import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Calendar, Clock, CheckCircle2, XCircle, UserX, ClipboardList, FileText, AlertCircle } from 'lucide-angular';
import { BehaviorSubject, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { DoctorService } from '../services/doctor.service';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';
import { AppointmentHistoryResponse } from '../models/doctor.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, SafeImagePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {
  private searchSubject = new BehaviorSubject<string>('');
  private filterSubject = new BehaviorSubject<string>('all');

  searchControl = new FormControl('');
  filterForm: FormGroup;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  stats = {
    completed: 0,
    canceled: 0,
    scheduled: 0
  };

  appointments: AppointmentHistoryResponse[] = [];
  filteredAppointments: AppointmentHistoryResponse[] = [];

  constructor(
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: ['all'],
      startDate: [this.getOneMonthAgoDate()],
      endDate: [this.getCurrentDate()]
    });
  }

  ngOnInit(): void {
    this.initializeSearchSubscription();
    this.initializeFilterSubscription();
    this.loadAppointments();
  }

  private getOneMonthAgoDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private initializeSearchSubscription(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchSubject.next(value || '');
      this.currentPage = 1;
      this.filterAppointments();
      this.cdr.markForCheck();
    });
  }

  private initializeFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadAppointments();
    });
  }

  loadAppointments(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.markForCheck();

    const doctorId = Number(localStorage.getItem('doctorId'));

    if (!doctorId) {
      this.error = 'No se pudo identificar al doctor.';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    const status = this.filterForm.get('status')?.value;
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;

    if (status === 'all') {
      const completedRequest = this.doctorService.getAppointmentHistory(doctorId, {
        status: 'completed',
        startDate,
        endDate
      });

      const canceledRequest = this.doctorService.getAppointmentHistory(doctorId, {
        status: 'canceled',
        startDate,
        endDate
      });

      const scheduledRequest = this.doctorService.getAppointmentHistory(doctorId, {
        status: 'scheduled',
        startDate,
        endDate
      });

      forkJoin([completedRequest, canceledRequest, scheduledRequest]).subscribe({
        next: ([completed, canceled, scheduled]) => {
          this.appointments = [...completed, ...canceled, ...scheduled];
          this.stats = {
            completed: completed.length,
            canceled: canceled.length,
            scheduled: scheduled.length
          };

          this.isLoading = false;
          this.filterAppointments();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Error al cargar el historial de citas. Por favor, intente nuevamente.';
          this.isLoading = false;
          console.error('Error loading appointment history:', error);
          this.cdr.markForCheck();
        }
      });
    } else {
      this.doctorService.getAppointmentHistory(doctorId, {
        status,
        startDate,
        endDate
      }).subscribe({
        next: (appointments) => {
          this.appointments = appointments;

          this.stats = {
            completed: status === 'completed' ? appointments.length : 0,
            canceled: status === 'canceled' ? appointments.length : 0,
            scheduled: status === 'scheduled' ? appointments.length : 0
          };

          this.isLoading = false;
          this.filterAppointments();
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.error = 'Error al cargar el historial de citas. Por favor, intente nuevamente.';
          this.isLoading = false;
          console.error('Error loading appointment history:', error);
          this.cdr.markForCheck();
        }
      });
    }
  }

  filterAppointments(): void {
    const searchTerm = this.searchSubject.getValue().toLowerCase();
    const status = this.filterForm.get('status')?.value;

    this.filteredAppointments = this.appointments.filter(appointment => {
      const patientName = `${appointment.patient.person.first_name} ${appointment.patient.person.last_name}`.toLowerCase();
      const reason = appointment.reason.toLowerCase();

      const matchesSearch = !searchTerm ||
        patientName.includes(searchTerm) ||
        reason.includes(searchTerm);

      const matchesStatus = status === 'all' || appointment.status === status;

      return matchesSearch && matchesStatus;
    });

    this.totalItems = this.filteredAppointments.length;
    this.cdr.markForCheck();
  }

  get paginatedAppointments(): AppointmentHistoryResponse[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAppointments.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.markForCheck();
    }
  }

  getCompletedCount(): number {
    return this.stats.completed;
  }

  getCanceledCount(): number {
    return this.stats.canceled;
  }

  getScheduledCount(): number {
    return this.stats.scheduled;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed': return 'Atendido';
      case 'canceled': return 'Cancelado';
      case 'scheduled': return 'Programado';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'canceled': return 'status-canceled';
      case 'scheduled': return 'status-scheduled';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const dateObj = new Date(dateString);
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

  trackByAppointmentId(index: number, appointment: AppointmentHistoryResponse): number {
    return appointment.id;
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  }

  protected readonly Search = Search;
  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly CheckCircle2 = CheckCircle2;
  protected readonly XCircle = XCircle;
  protected readonly UserX = UserX;
  protected readonly ClipboardList = ClipboardList;
  protected readonly FileText = FileText;
  protected readonly AlertCircle = AlertCircle;
}