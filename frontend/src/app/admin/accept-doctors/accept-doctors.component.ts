import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, Award, Building, Phone, FileText, Check, X, User, UserX } from 'lucide-angular';

@Component({
  selector: 'app-accept-doctors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './accept-doctors.component.html',
  styleUrls: ['./accept-doctors.component.css']
})
export class AcceptDoctorsComponent implements OnInit {
  isLoading: boolean = true;
  pendingDoctors = [1, 2, 3, 4, 5]; 

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  protected readonly Search = Search;
  protected readonly Award = Award;
  protected readonly Building = Building;
  protected readonly Phone = Phone;
  protected readonly FileText = FileText;
  protected readonly Check = Check;
  protected readonly X = X;
  protected readonly User = User;
  protected readonly UserX = UserX;
}