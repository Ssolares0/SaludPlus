import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Calendar, User, Mail, Check, X } from 'lucide-angular';

@Component({
  selector: 'app-accept-patients',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './accept-patients.component.html',
  styleUrls: ['./accept-patients.component.css']
})

export class AcceptPatientsComponent {
  protected readonly Search = Search;
  protected readonly Calendar = Calendar;
  protected readonly User = User;
  protected readonly Mail = Mail;
  protected readonly Check = Check;
  protected readonly X = X;
}