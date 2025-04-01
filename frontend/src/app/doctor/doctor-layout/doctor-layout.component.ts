import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import {
  LucideAngularModule,
  Calendar,
  Clock,
  History,
  User,
  ChevronDown,
  LogOut
} from 'lucide-angular';
import { DoctorService } from '../services/doctor.service';
import { DataDoctorResponse } from '../models/doctor.model';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SafeImagePipe],
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.css']
})
export class DoctorLayoutComponent implements OnInit {
  isDropdownOpen = false;
  doctorData?: DataDoctorResponse;

  navItems = [
    {
      label: 'Gestión de Citas',
      icon: Calendar,
      route: '/doctor/appointments',
      active: false
    },
    {
      label: 'Horarios',
      icon: Clock,
      route: '/doctor/schedules',
      active: false
    },
    {
      label: 'Historial',
      icon: History,
      route: '/doctor/history',
      active: false
    },
    {
      label: 'Mi Perfil',
      icon: User,
      route: '/doctor/profile',
      active: false
    }
  ];

  constructor(
    private router: Router,
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.updateActiveItem(this.router.url);
    this.loadDoctorData();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveItem(event.url);
      }
    });
  }

  private loadDoctorData() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.doctorService.getDataDoctor(Number(userId)).subscribe({
        next: (data) => {
          this.doctorData = data;
        },
        error: (error) => {
          console.error('Error al cargar datos del doctor:', error);
        }
      });
    }
  }

  private updateActiveItem(url: string) {
    this.navItems.forEach(item => {
      item.active = url.includes(item.route);
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = false;
  }

  protected readonly LogOut = LogOut;
  protected readonly ChevronDown = ChevronDown;
}