import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  User,
  Search,
  FileText,
  Edit,
  ChevronLeft,
  ChevronRight,
  UserX,
  Circle
} from 'lucide-angular';

@Component({
  selector: 'app-view-patients',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './view-patients.component.html',
  styleUrls: ['./view-patients.component.css']
})
export class ViewPatientsComponent {
  protected readonly User = User;
  protected readonly Search = Search;
  protected readonly FileText = FileText;
  protected readonly Edit = Edit;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly UserX = UserX;
  protected readonly Circle = Circle;
}