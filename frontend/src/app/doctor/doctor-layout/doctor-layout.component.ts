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

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.css']
})

export class DoctorLayoutComponent implements OnInit {
  isDropdownOpen = false;

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

  constructor(private router: Router) { }

  ngOnInit() {
    this.updateActiveItem(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveItem(event.url);
      }
    });
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