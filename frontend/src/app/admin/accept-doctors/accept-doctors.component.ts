import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Award, Building, Phone, FileText, Check, X, User } from 'lucide-angular';

@Component({
  selector: 'app-accept-doctors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './accept-doctors.component.html',
  styleUrls: ['./accept-doctors.component.css']
})

export class AcceptDoctorsComponent {
  protected readonly Search = Search;
  protected readonly Award = Award;
  protected readonly Building = Building;
  protected readonly Phone = Phone;
  protected readonly FileText = FileText;
  protected readonly Check = Check;
  protected readonly X = X;
  protected readonly User = User; 
}