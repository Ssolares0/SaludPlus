import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { UserCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.css'
})

export class RegisterPatientComponent {
  constructor() { }

  protected readonly UserCircle2 = UserCircle2;
}
