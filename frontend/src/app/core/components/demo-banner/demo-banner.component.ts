import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Info, X } from 'lucide-angular';
import { demoConfig } from '../../config/demo.config';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="showBanner && isDemoMode" class="demo-banner">
      <div class="banner-content">
        <div class="banner-info">
          <lucide-icon [img]="InfoIcon" class="info-icon"></lucide-icon>
          <div class="banner-text">
            <h4>🚀 Modo Demo - SaludPlus</h4>
            <p>Esta es una demostración del sistema. Puedes usar estas credenciales de prueba:</p>
            <div class="credentials">
              <div class="credential-item">
                <strong>👑 Admin:</strong> admin&#64;gmail.com / admin123
              </div>
              <div class="credential-item">
                <strong>👨‍⚕️ Doctor:</strong> prueba&#64;gmail.com / prueba123
              </div>
              <div class="credential-item">
                <strong>🧑‍🤝‍🧑 Paciente:</strong> paciente&#64;gmail.com / paciente123
              </div>
            </div>
          </div>
        </div>
        <button (click)="closeBanner()" class="close-btn">
          <lucide-icon [img]="XIcon"></lucide-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .demo-banner {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from { transform: translateY(-100%); }
      to { transform: translateY(0); }
    }

    .banner-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .banner-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .info-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .banner-text h4 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .banner-text p {
      margin: 0 0 12px 0;
      font-size: 14px;
      opacity: 0.9;
    }

    .credentials {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .credential-item {
      font-size: 13px;
      background: rgba(255,255,255,0.1);
      padding: 6px 12px;
      border-radius: 6px;
      backdrop-filter: blur(10px);
    }

    .close-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      background: rgba(255,255,255,0.2);
    }

    .close-btn lucide-icon {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 768px) {
      .banner-content {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }

      .credentials {
        justify-content: center;
      }

      .credential-item {
        font-size: 12px;
        padding: 4px 8px;
      }
    }
  `]
})
export class DemoBannerComponent {
  InfoIcon = Info;
  XIcon = X;
  showBanner = true;
  isDemoMode = demoConfig.isDemoMode;

  closeBanner() {
    this.showBanner = false;
    // Guardar en localStorage para recordar que el usuario cerró el banner
    localStorage.setItem('demoBannerClosed', 'true');
  }

  ngOnInit() {
    // No mostrar el banner si el usuario ya lo cerró
    const bannerClosed = localStorage.getItem('demoBannerClosed');
    if (bannerClosed === 'true') {
      this.showBanner = false;
    }
  }
}