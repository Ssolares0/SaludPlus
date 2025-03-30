import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Download, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

export class ReportsComponent {
  protected readonly download = Download;
  protected readonly calendar = Calendar;
}