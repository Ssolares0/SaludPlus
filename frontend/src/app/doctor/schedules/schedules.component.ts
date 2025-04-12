import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Clock, Check, Save, RefreshCw } from 'lucide-angular';
import { DoctorService } from '../services/doctor.service';
import { SchedulesResponse, DoctorScheduleBody } from '../models/doctor.model';
import { ModalComponent } from '../../core/components/modal/modal.component';

interface DayOption {
  value: number;
  label: string;
}

interface DoctorSchedule {
  workingDays: number[];
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ModalComponent],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})

export class SchedulesComponent implements OnInit {
  loading = true;
  error = false;
  saving = false;

  doctorId!: number;
  schedules: SchedulesResponse[] = [];

  doctorSchedule: DoctorSchedule = {
    workingDays: [],
    startTime: '08:00',
    endTime: '17:00',
  };

  availableDays: DayOption[] = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 7, label: 'Domingo' }
  ];

  availableStartTimes: string[] = this.generateTimeOptions(7, 18);
  availableEndTimes: string[] = this.generateTimeOptions(8, 20);

  modalVisible = false;
  modalType: 'success' | 'warning' | 'error' = 'warning';
  modalTitle = '';
  modalMessage = '';
  modalShowConfirmButton = false;
  isConfirmationModal = false;

  constructor(
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.doctorId = localStorage.getItem('doctorId') ? parseInt(localStorage.getItem('doctorId')!) : 0;
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.loading = true;
    this.error = false;

    this.doctorService.getSchedules(this.doctorId).subscribe({
      next: (data) => {
        this.schedules = data;
        this.mapSchedulesToForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  mapSchedulesToForm(): void {
    if (this.schedules.length > 0) {
      this.doctorSchedule.workingDays = this.schedules.map(schedule => schedule.day_of_week);

      if (this.schedules[0]) {
        this.doctorSchedule.startTime = this.formatTime(this.schedules[0].start_time);
        this.doctorSchedule.endTime = this.formatTime(this.schedules[0].end_time);
      }
    } else {
      this.doctorSchedule = {
        workingDays: [],
        startTime: '08:00',
        endTime: '17:00',
      };
    }
  }

  formatTime(time: string): string {
    return time.substring(0, 5);
  }

  generateTimeOptions(startHour: number, endHour: number): string[] {
    const options: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return options;
  }

  toggleDay(day: number): void {
    const index = this.doctorSchedule.workingDays.indexOf(day);
    if (index === -1) {
      this.doctorSchedule.workingDays.push(day);
    } else {
      this.doctorSchedule.workingDays.splice(index, 1);
    }
  }

  isDaySelected(day: number): boolean {
    return this.doctorSchedule.workingDays.includes(day);
  }

  getWorkingDaysText(): string {
    if (this.doctorSchedule.workingDays.length === 0) {
      return 'Ningún día seleccionado';
    }

    const dayLabels = this.doctorSchedule.workingDays.map(dayValue => {
      const day = this.availableDays.find(d => d.value === dayValue);
      return day ? day.label : '';
    }).sort((a, b) => {
      const dayOrder = {
        'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4,
        'Viernes': 5, 'Sábado': 6, 'Domingo': 7
      };
      return dayOrder[a as keyof typeof dayOrder] - dayOrder[b as keyof typeof dayOrder];
    });

    return dayLabels.join(', ');
  }

  validateSchedule(): boolean {
    if (this.doctorSchedule.workingDays.length === 0) {
      this.showModal('warning', 'Datos incompletos', 'Debe seleccionar al menos un día de atención.');
      return false;
    }

    const startTime = this.doctorSchedule.startTime;
    const endTime = this.doctorSchedule.endTime;

    if (startTime >= endTime) {
      this.showModal('warning', 'Horario inválido', 'La hora de inicio debe ser anterior a la hora de fin.');
      return false;
    }

    return true;
  }

  confirmSaveSchedules(): void {
    if (!this.validateSchedule()) {
      return;
    }

    const isUpdate = this.schedules.length > 0;
    const modalTitle = isUpdate ? 'Actualizar Horario' : 'Crear Horario';
    const modalMessage = isUpdate
      ? '¿Está seguro que desea actualizar su horario de atención? Esto modificará los días y horas en que estará disponible para citas.'
      : '¿Está seguro que desea crear su horario de atención? Esto establecerá los días y horas en que estará disponible para citas.';

    this.modalType = 'warning';
    this.modalTitle = modalTitle;
    this.modalMessage = modalMessage;
    this.modalShowConfirmButton = true;
    this.isConfirmationModal = true;
    this.modalVisible = true;
  }

  saveSchedules(): void {
    this.saving = true;

    const scheduleData: DoctorScheduleBody = {
      days: this.doctorSchedule.workingDays,
      startTime: this.doctorSchedule.startTime,
      endTime: this.doctorSchedule.endTime
    };

    this.doctorService.setDoctorSchedule(this.doctorId, scheduleData).subscribe({
      next: (response) => {
        this.saving = false;

        const isUpdate = this.schedules.length > 0;
        const successTitle = isUpdate ? 'Horario Actualizado' : 'Horario Creado';
        const successMessage = isUpdate
          ? 'Su horario de atención ha sido actualizado correctamente. Los pacientes podrán agendar citas en los días y horarios establecidos.'
          : 'Su horario de atención ha sido creado correctamente. Los pacientes podrán agendar citas en los días y horarios establecidos.';

        this.showModal('success', successTitle, successMessage);

        this.loadSchedules();
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al guardar horario:', err);
        this.showModal('error', 'Error al guardar', 'Ocurrió un error al guardar su horario. Por favor, intente nuevamente.');
      }
    });
  }

  showModal(type: 'success' | 'warning' | 'error', title: string, message: string): void {
    this.modalType = type;
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalShowConfirmButton = false;
    this.isConfirmationModal = false;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  onConfirmAction(): void {
    if (this.isConfirmationModal) {
      this.saveSchedules();
    }
    this.closeModal();
  }

  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly Check = Check;
  protected readonly Save = Save;
  protected readonly RefreshCw = RefreshCw;
}