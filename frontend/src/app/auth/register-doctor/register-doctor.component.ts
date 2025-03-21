import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { UserCircle2 } from 'lucide-angular';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css'
})

export class RegisterDoctorComponent {
  constructor() { }

  protected readonly UserCircle2 = UserCircle2;
}