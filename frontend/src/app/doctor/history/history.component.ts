import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Calendar, Clock, CheckCircle2, XCircle, UserX, ClipboardList } from 'lucide-angular';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';

interface Appointment {
  id: number;
  date: string;
  time: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  reason: string;
  symptoms: string;
  status: 'attended' | 'cancelled_doctor' | 'cancelled_patient';
  treatment?: string;
  cancellationReason?: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent implements OnInit {
  private searchSubject = new BehaviorSubject<string>('');
  private filterSubject = new BehaviorSubject<string>('all');

  searchTerm: string = '';
  selectedFilter: string = 'all';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalItems: number = 0;
  isLoading: boolean = true;

  private cachedStats = {
    attended: 0,
    cancelled_doctor: 0,
    cancelled_patient: 0
  };

  appointments: Appointment[] = [
    {
      id: 1,
      date: '2024-03-15',
      time: '09:00',
      patientName: 'Juan Pérez',
      patientAge: 45,
      patientGender: 'Masculino',
      reason: 'Consulta general',
      symptoms: 'Dolor de cabeza y mareos frecuentes',
      status: 'attended',
      treatment: 'Reposo y medicamentos antiinflamatorios. Se receta paracetamol 500mg cada 8 horas por 5 días y abundante hidratación.'
    },
    {
      id: 2,
      date: '2024-03-14',
      time: '10:30',
      patientName: 'María García',
      patientAge: 35,
      patientGender: 'Femenino',
      reason: 'Control mensual',
      symptoms: 'Seguimiento de tratamiento',
      status: 'cancelled_doctor',
      cancellationReason: 'Emergencia médica'
    },
    {
      id: 3,
      date: '2024-03-13',
      time: '15:00',
      patientName: 'Carlos López',
      patientAge: 52,
      patientGender: 'Masculino',
      reason: 'Dolor de espalda',
      symptoms: 'Dolor lumbar agudo',
      status: 'cancelled_patient'
    },
    {
      id: 4,
      date: '2024-03-12',
      time: '11:00',
      patientName: 'Ana Torres',
      patientAge: 28,
      patientGender: 'Femenino',
      reason: 'Consulta de rutina',
      symptoms: 'Chequeo general',
      status: 'attended',
      treatment: 'Todo en orden, se recomienda chequeo anual.'
    },
    {
      id: 5,
      date: '2024-03-11',
      time: '14:00',
      patientName: 'Luis Martínez',
      patientAge: 60,
      patientGender: 'Masculino',
      reason: 'Consulta por alergias',
      symptoms: 'Estornudos y picazón en los ojos',
      status: 'attended'
    },
    {
      id: 6,
      date: '2024-03-10',
      time: '16:30',
      patientName: 'Laura Fernández',
      patientAge: 40,
      patientGender: 'Femenino',
      reason: 'Control de diabetes',
      symptoms: 'Control de glucosa y presión arterial',
      status: 'attended'
    },
    {
      id: 7,
      date: '2024-03-09',
      time: '09:30',
      patientName: 'Javier Ramírez',
      patientAge: 50,
      patientGender: 'Masculino',
      reason: 'Consulta por hipertensión',
      symptoms: 'Dolor de cabeza y mareos frecuentes',
      status: 'attended'
    },
    {
      id: 8,
      date: '2024-03-08',
      time: '10:00',
      patientName: 'Sofía Castro',
      patientAge: 30,
      patientGender: 'Femenino',
      reason: 'Chequeo de rutina',
      symptoms: 'Todo en orden, se recomienda chequeo anual.',
      status: 'attended'
    }
  ];

  private filteredAppointmentsCache: Appointment[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeSearchSubscription();
    this.initializeFilterSubscription();
    this.calculateStats();

    setTimeout(() => {
      this.isLoading = false;
      this.totalItems = this.appointments.length;
      this.cdr.markForCheck();
    }, 800);
  }

  private initializeSearchSubscription(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.updateFilteredAppointments();
    });
  }

  private initializeFilterSubscription(): void {
    this.filterSubject.pipe(
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.updateFilteredAppointments();
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  onFilterChange(value: string): void {
    this.selectedFilter = value;
    this.filterSubject.next(value);
  }

  private calculateStats(): void {
    this.cachedStats = {
      attended: this.appointments.filter(a => a.status === 'attended').length,
      cancelled_doctor: this.appointments.filter(a => a.status === 'cancelled_doctor').length,
      cancelled_patient: this.appointments.filter(a => a.status === 'cancelled_patient').length
    };
  }

  private updateFilteredAppointments(): void {
    this.filteredAppointmentsCache = this.appointments
      .filter(app =>
        app.patientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.reason.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .filter(app =>
        this.selectedFilter === 'all' ||
        app.status === this.selectedFilter
      );

    this.totalItems = this.filteredAppointmentsCache.length;
    this.cdr.markForCheck();
  }

  get filteredAppointments(): Appointment[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredAppointmentsCache.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.markForCheck();
    }
  }

  getAttendedCount(): number {
    return this.cachedStats.attended;
  }

  getCancelledByDoctorCount(): number {
    return this.cachedStats.cancelled_doctor;
  }

  getCancelledByPatientCount(): number {
    return this.cachedStats.cancelled_patient;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'attended': return 'Atendido';
      case 'cancelled_doctor': return 'Cancelado por médico';
      case 'cancelled_patient': return 'Cancelado por paciente';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'attended': return 'status-attended';
      case 'cancelled_doctor': return 'status-cancelled-doctor';
      case 'cancelled_patient': return 'status-cancelled-patient';
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

  trackByAppointmentId(index: number, appointment: Appointment): number {
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
}