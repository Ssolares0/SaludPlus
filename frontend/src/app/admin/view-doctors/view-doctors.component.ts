import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Search,
  Users,
  Calendar,
  Star,
  Phone,
  Building,
  User,
  Edit,
  ChevronLeft,
  ChevronRight,
  UserX,
  Circle,
  FileText
} from 'lucide-angular';

@Component({
  selector: 'app-view-doctors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './view-doctors.component.html',
  styleUrls: ['./view-doctors.component.css']
})

export class ViewDoctorsComponent {
  protected readonly Search = Search;
  protected readonly Users = Users;
  protected readonly Calendar = Calendar;
  protected readonly Star = Star;
  protected readonly Phone = Phone;
  protected readonly Building = Building;
  protected readonly User = User;
  protected readonly Edit = Edit;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly UserX = UserX; 
  protected readonly Circle = Circle;
  protected readonly FileText = FileText; 
}