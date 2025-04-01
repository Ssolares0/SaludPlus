import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, AlertTriangle, Home } from 'lucide-angular';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule],
    template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="logo">
          <img src="assets/images/login/logo.png" alt="SaludPlus Logo">
        </div>
        <h1 class="not-found-title">404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que estás buscando no existe o no tienes permisos para acceder a ella.</p>
        <div class="back-link">
          <button class="btn-back" (click)="navigateBack()">
            <i-lucide [name]="Home"></i-lucide>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  `,
    styles: `
    .not-found-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--marfil-ligero-100);
      padding: 2rem;
    }
    
    .not-found-content {
      max-width: 500px;
      text-align: center;
      background-color: var(--blanco);
      padding: 3rem;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--strokes);
    }
    
    .logo {
      margin-bottom: 1.5rem;
    }
    
    .logo img {
      height: 3rem;
      width: auto;
    }
    
    .not-found-icon {
      width: 5rem;
      height: 5rem;
      margin: 0 auto 1.5rem;
      color: var(--azl-serenidad-500);
    }
    
    .not-found-title {
      font-size: 4rem;
      font-weight: 700;
      color: var(--azl-serenidad-500);
      margin: 0 0 1rem;
      line-height: 1;
    }
    
    h2 {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--negro-suave);
      margin: 0 0 1rem;
    }
    
    p {
      color: var(--gris-600);
      margin-bottom: 2rem;
      line-height: 1.5;
    }
    
    .back-link {
      margin-top: 1rem;
    }
    
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--azl-serenidad-500);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-back:hover {
      background-color: var(--azl-serenidad-600);
    }
    
    @media (max-width: 576px) {
      .not-found-content {
        padding: 2rem;
      }
      
      .not-found-title {
        font-size: 3rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
    }
  `
})
export class NotFoundComponent {
    protected readonly AlertTriangle = AlertTriangle;
    protected readonly Home = Home;

    constructor(private router: Router) { }

    navigateBack(): void {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRoleName');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';

        if (!token) {
            this.router.navigate(['/']);
        } else if (isAdmin) {
            this.router.navigate(['/admin/reports']);
        } else if (userRole === 'doctor') {
            this.router.navigate(['/doctor/appointments']);
        } else if (userRole === 'paciente') {
            this.router.navigate(['/patients']);
        } else {
            localStorage.clear();
            this.router.navigate(['/']);
        }
    }
}