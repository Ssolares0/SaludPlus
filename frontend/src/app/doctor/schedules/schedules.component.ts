import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Calendar, Clock, Check, Save, RefreshCw } from 'lucide-angular';

interface DayOption {
  value: string;
  label: string;
}

interface DurationOption {
  value: number;
  label: string;
}

interface DoctorSchedule {
  workingDays: string[];
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})

export class SchedulesComponent implements OnInit {
  isScheduleActive = true;
  
  doctorSchedule: DoctorSchedule = {
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    startTime: '08:00',
    endTime: '17:00',
    slotDuration: 30,
    isActive: true
  };
  
  availableDays: DayOption[] = [
    { value: 'monday', label: 'Lunes' },
    { value: 'tuesday', label: 'Martes' },
    { value: 'wednesday', label: 'Miércoles' },
    { value: 'thursday', label: 'Jueves' },
    { value: 'friday', label: 'Viernes' },
    { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];
  
  availableStartTimes: string[] = this.generateTimeOptions(7, 18);
  availableEndTimes: string[] = this.generateTimeOptions(8, 20);
  
  availableDurations: DurationOption[] = [
    { value: 15, label: '15 min' },
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '1 hora' }
  ];

  ngOnInit(): void {
    this.isScheduleActive = this.doctorSchedule.isActive;
  }

  generateTimeOptions(startHour: number, endHour: number): string[] {
    const options: string[] = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < endHour) {
        options.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return options;
  }

  toggleDay(day: string): void {
    const index = this.doctorSchedule.workingDays.indexOf(day);
    if (index === -1) {
      this.doctorSchedule.workingDays.push(day);
    } else {
      this.doctorSchedule.workingDays.splice(index, 1);
    }
  }

  isDaySelected(day: string): boolean {
    return this.doctorSchedule.workingDays.includes(day);
  }

  selectDuration(duration: number): void {
    this.doctorSchedule.slotDuration = duration;
  }

  getWorkingDaysText(): string {
    if (this.doctorSchedule.workingDays.length === 0) {
      return 'Ningún día seleccionado';
    }

    const dayLabels = this.doctorSchedule.workingDays.map(dayValue => {
      const day = this.availableDays.find(d => d.value === dayValue);
      return day ? day.label : '';
    });

    return dayLabels.join(', ');
  }

  resetForm(): void {
    this.doctorSchedule = {
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '08:00',
      endTime: '17:00',
      slotDuration: 30,
      isActive: true
    };
    this.isScheduleActive = true;
  }

  saveSchedules(): void {
    this.doctorSchedule.isActive = this.isScheduleActive;
    console.log('Guardando horario:', this.doctorSchedule);
    alert('Horario guardado correctamente');
  }

  protected readonly Calendar = Calendar;
  protected readonly Clock = Clock;
  protected readonly Check = Check;
  protected readonly Save = Save;
  protected readonly RefreshCw = RefreshCw;
}