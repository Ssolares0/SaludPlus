import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import {
  LucideAngularModule,
  Users,
  ClipboardList,
  FileText,
  ChevronDown,
  LogOut
} from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})

export class AdminLayoutComponent implements OnInit {
  isDropdownOpen = false;

  navItems = [
    {
      label: 'Aceptar pacientes',
      icon: Users,
      route: '/admin/accept-patients',
      active: false
    },
    {
      label: 'Aceptar médicos',
      icon: Users,
      route: '/admin/accept-doctors',
      active: false
    },
    {
      label: 'Ver pacientes',
      icon: ClipboardList,
      route: '/admin/view-patients',
      active: false
    },
    {
      label: 'Ver médicos',
      icon: ClipboardList,
      route: '/admin/view-doctors',
      active: false
    },
    {
      label: 'Reportes',
      icon: FileText,
      route: '/admin/reports',
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