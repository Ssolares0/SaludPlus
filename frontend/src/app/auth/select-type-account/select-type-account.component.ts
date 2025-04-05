import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, UserRound, Stethoscope, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-select-type-account',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './select-type-account.component.html',
  styleUrl: './select-type-account.component.css'
})
export class SelectTypeAccountComponent {
  selectedAccount: 'paciente' | 'medico' | null = null;

  constructor(private router: Router) { }

  selectAccount(type: 'paciente' | 'medico') {
    this.selectedAccount = type === this.selectedAccount ? null : type;
  }

  continueRegistration() {
    if (this.selectedAccount) {
      if (this.selectedAccount === 'paciente') {
        this.router.navigate(['register-patient']);
      } else if (this.selectedAccount === 'medico') {
        this.router.navigate(['register-doctor']);
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  protected readonly UserRound = UserRound;
  protected readonly Stethoscope = Stethoscope;
  protected readonly ArrowLeft = ArrowLeft;
}