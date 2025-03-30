import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule, Download, Calendar } from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DecimalPipe],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  dailyReports = [1, 2, 3, 4, 5];
  topDoctors = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    console.log('Inicializando gráficos...');
  }

  selectDatePeriod(period: string): void {
    console.log(`Periodo seleccionado: ${period}`);
  }

  downloadReport(reportType: string): void {
    console.log(`Descargando reporte: ${reportType}`);
  }
  
  protected readonly download = Download;
  protected readonly calendar = Calendar;
}