import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Calendar, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-angular';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsComponent implements OnInit {
  searchControl = new FormControl('');
  filterControl = new FormControl('all');
  treatmentForm!: FormGroup;

  appointments = [
    {
      id: 1,
      date: '2024-02-20',
      time: '09:00',
      patientName: 'Juan Pérez',
      patientAge: 45,
      patientGender: 'Masculino',
      reason: 'Consulta general',
      symptoms: 'Dolor de cabeza y mareos frecuentes',
      status: 'pending'
    },
    {
      id: 2,
      date: '2024-02-20',
      time: '10:00',
      patientName: 'María García',
      patientAge: 32,
      patientGender: 'Femenino',
      reason: 'Seguimiento tratamiento',
      symptoms: 'Control de presión arterial',
      status: 'confirmed'
    },
    {
      id: 3,
      date: '2024-02-20',
      time: '11:00',
      patientName: 'Carlos López',
      patientAge: 28,
      patientGender: 'Masculino',
      reason: 'Dolor de cabeza',
      symptoms: 'Migraña intensa con sensibilidad a la luz',
      status: 'urgent'
    },
    {
      id: 4,
      date: '2024-02-20',
      time: '12:00',
      patientName: 'Ana Martínez',
      patientAge: 50,
      patientGender: 'Femenino',
      reason: 'Chequeo anual',
      symptoms: 'Ninguno',
      status: 'pending'
    },
    {
      id: 5,
      date: '2024-02-20',
      time: '13:00',
      patientName: 'Luis Fernández',
      patientAge: 60,
      patientGender: 'Masculino',
      reason: 'Consulta de seguimiento',
      symptoms: 'Control de diabetes tipo 2',
      status: 'confirmed'
    }
  ];

  filteredAppointments = this.appointments;

  stats = {
    pending: 0,
    confirmed: 0,
    urgent: 0
  };

  showTreatmentModal = false;
  selectedAppointment: any = null;

  ngOnInit(): void {
    this.calculateStats();
    this.setupForms();

    this.searchControl.valueChanges.subscribe(value => {
      this.filterAppointments();
    });

    this.filterControl.valueChanges.subscribe(value => {
      this.filterAppointments();
    });
  }

  setupForms(): void {
    this.treatmentForm = new FormGroup({
      treatmentText: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  calculateStats(): void {
    this.stats = {
      pending: this.appointments.filter(a => a.status === 'pending').length,
      confirmed: this.appointments.filter(a => a.status === 'confirmed').length,
      urgent: this.appointments.filter(a => a.status === 'urgent').length
    };
  }

  filterAppointments(): void {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const filterValue = this.filterControl.value;

    this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesSearch = searchTerm ?
        appointment.patientName.toLowerCase().includes(searchTerm) : true;

      const matchesFilter = filterValue === 'all' ?
        true : appointment.status === filterValue;

      return matchesSearch && matchesFilter;
    });
  }

  openTreatmentModal(appointment: any) {
    this.selectedAppointment = appointment;
    this.showTreatmentModal = true;
    this.treatmentForm.reset();
  }

  closeTreatmentModal() {
    this.showTreatmentModal = false;
    this.selectedAppointment = null;
  }

  saveTreatment() {
    if (this.treatmentForm.invalid) {
      this.treatmentForm.markAllAsTouched();
      return;
    }

    const treatment = this.treatmentForm.get('treatmentText')?.value;
    console.log('Tratamiento guardado:', treatment);
    console.log('Para paciente:', this.selectedAppointment?.patientName);

    this.closeTreatmentModal();
  }

  cancelAppointment(appointment: any) {
    console.log('Cita cancelada:', appointment);
  }

  trackByAppointmentId(index: number, appointment: any): number {
    return appointment.id;
  }

  protected readonly Search = Search;
  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly User = User;
  protected readonly FileText = FileText;
  protected readonly CheckCircle2 = CheckCircle2;
  protected readonly XCircle = XCircle;
  protected readonly AlertCircle = AlertCircle;
  protected readonly X = X;
}