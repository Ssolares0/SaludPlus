import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule, Download, FileText, Users } from 'lucide-angular';
import { AdminService } from '../services/admin.service';
import { StatisticsResponse, StatisticsBody, ActiveDoctorsResponse, ActivePatientsResponse } from "../models/admin.models";
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import { forkJoin } from 'rxjs';
import autoTable from 'jspdf-autotable';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DecimalPipe, FormsModule, SafeImagePipe],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})

export class ReportsComponent implements OnInit, AfterViewInit {
  topDoctors: StatisticsResponse[] = [];
  filteredTopDoctors: StatisticsResponse[] = [];
  activeDoctors: ActiveDoctorsResponse[] = [];
  activePatients: ActivePatientsResponse[] = [];

  doctorsBySpecialty: { specialty: string, count: number }[] = [];
  genderDistribution = {
    doctors: { male: 0, female: 0, other: 0 },
    patients: { male: 0, female: 0, other: 0 }
  };

  chartsInitialized = false;
  totalDoctors = 0;
  totalPatients = 0;

  loading = true;
  error: string | null = null;

  selectedSpecialty = '';
  specialties: string[] = [];

  charts: Record<string, Chart> = {};

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initializeCharts(), 1000);
  }

  ngAfterViewChecked(): void {
    if (!this.loading && !this.error && !this.chartsInitialized) {
      this.initializeCharts();
    }
  }

  loadAllData(): void {
    this.loading = true;

    forkJoin({
      topDoctors: this.adminService.getStatistics({}),
      activeDoctors: this.adminService.getActiveDoctors(),
      activePatients: this.adminService.getActivePatients()
    }).subscribe({
      next: (results) => {
        this.topDoctors = results.topDoctors || [];
        this.filteredTopDoctors = [...this.topDoctors];
        this.activeDoctors = results.activeDoctors || [];
        this.activePatients = results.activePatients || [];

        this.totalDoctors = this.activeDoctors.length;
        this.totalPatients = this.activePatients.length;

        this.specialties = this.extractSpecialties(this.activeDoctors);

        this.doctorsBySpecialty = this.calculateDoctorsBySpecialty(this.activeDoctors);

        this.calculateGenderDistribution(this.activeDoctors, this.activePatients);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.error = 'No se pudieron cargar los datos. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  filterBySpecialty(specialty: string): void {
    this.selectedSpecialty = specialty;

    if (specialty) {
      this.loading = true;

      this.adminService.getStatistics({ specialty }).subscribe({
        next: (data) => {
          this.filteredTopDoctors = data || [];
          this.loading = false;
          this.updateCharts();
        },
        error: (err) => {
          console.error('Error al filtrar por especialidad:', err);
          this.loading = false;
          this.error = 'Error al filtrar por especialidad. Por favor, intente nuevamente.';
        }
      });
    } else {
      this.filteredTopDoctors = [...this.topDoctors];
      this.updateCharts();
    }
  }

  private extractSpecialties(doctors: ActiveDoctorsResponse[]): string[] {
    const specialtiesSet = new Set<string>();

    doctors.forEach(doctor => {
      if (doctor.specialty && Array.isArray(doctor.specialty)) {
        doctor.specialty.forEach(spec => {
          if (spec && spec.specialty && spec.specialty.name) {
            specialtiesSet.add(spec.specialty.name);
          }
        });
      }
    });

    return Array.from(specialtiesSet).sort();
  }

  private calculateDoctorsBySpecialty(doctors: ActiveDoctorsResponse[]): { specialty: string, count: number }[] {
    const specialtyCounts: { [key: string]: number } = {};

    doctors.forEach(doctor => {
      if (doctor.specialty && Array.isArray(doctor.specialty)) {
        doctor.specialty.forEach(spec => {
          if (spec && spec.specialty && spec.specialty.name) {
            const specName = spec.specialty.name;
            specialtyCounts[specName] = (specialtyCounts[specName] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(specialtyCounts)
      .map(([specialty, count]) => ({ specialty, count }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateGenderDistribution(doctors: ActiveDoctorsResponse[], patients: ActivePatientsResponse[]): void {
    this.genderDistribution = {
      doctors: { male: 0, female: 0, other: 0 },
      patients: { male: 0, female: 0, other: 0 }
    };

    doctors.forEach(doctor => {
      if (!doctor.gender) return;

      const genderValue = typeof doctor.gender === 'string' && !isNaN(Number(doctor.gender))
        ? Number(doctor.gender)
        : doctor.gender.toLowerCase();

      if (genderValue === 1 || genderValue === '1' ||
        genderValue === 'male' || genderValue === 'masculino' || genderValue === 'm') {
        this.genderDistribution.doctors.male++;
      } else if (genderValue === 2 || genderValue === '2' ||
        genderValue === 'female' || genderValue === 'femenino' || genderValue === 'f') {
        this.genderDistribution.doctors.female++;
      } else {
        this.genderDistribution.doctors.other++;
      }
    });

    patients.forEach(patient => {
      if (!patient.gender) return;

      const genderValue = typeof patient.gender === 'string' && !isNaN(Number(patient.gender))
        ? Number(patient.gender)
        : patient.gender.toLowerCase();

      if (genderValue === 1 || genderValue === '1' ||
        genderValue === 'male' || genderValue === 'masculino' || genderValue === 'm') {
        this.genderDistribution.patients.male++;
      } else if (genderValue === 2 || genderValue === '2' ||
        genderValue === 'female' || genderValue === 'femenino' || genderValue === 'f') {
        this.genderDistribution.patients.female++;
      } else {
        this.genderDistribution.patients.other++;
      }
    });
  }

  private initializeCharts(): void {
    try {
      const specialtyCanvas = document.getElementById('specialtyDistributionChart') as HTMLCanvasElement;
      const genderCanvas = document.getElementById('genderDistributionChart') as HTMLCanvasElement;

      // Solo inicializar si ambos canvas existen
      if (specialtyCanvas && genderCanvas) {
        this.initSpecialtyDistributionChart();
        this.initGenderDistributionChart();
        this.updateCharts();
        this.chartsInitialized = true;
      }
    } catch (error) {
      console.error("Error al inicializar gráficos:", error);
    }
  }

  private updateCharts(): void {
    if (!this.chartsInitialized || !this.charts) {
      return;
    }

    try {
      if (this.charts['specialtyDistributionChart'] && this.doctorsBySpecialty.length > 0) {

        const topSpecialties = this.doctorsBySpecialty.slice(0, Math.min(5, this.doctorsBySpecialty.length));

        if (this.doctorsBySpecialty.length > 5) {
          const otherCount = this.doctorsBySpecialty.slice(5).reduce((sum, item) => sum + item.count, 0);
          topSpecialties.push({ specialty: 'Otras', count: otherCount });
        }

        const labels = topSpecialties.map(item => item.specialty);
        const data = topSpecialties.map(item => item.count);

        const backgroundColors = [
          'rgba(66, 153, 225, 0.8)',
          'rgba(236, 201, 75, 0.8)',
          'rgba(72, 187, 120, 0.8)',
          'rgba(237, 137, 54, 0.8)',
          'rgba(159, 122, 234, 0.8)',
          'rgba(113, 128, 150, 0.8)'
        ].slice(0, labels.length);

        const borderColors = [
          'rgba(66, 153, 225, 1)',
          'rgba(236, 201, 75, 1)',
          'rgba(72, 187, 120, 1)',
          'rgba(237, 137, 54, 1)',
          'rgba(159, 122, 234, 1)',
          'rgba(113, 128, 150, 1)'
        ].slice(0, labels.length);

        this.charts['specialtyDistributionChart'].data.labels = labels;
        this.charts['specialtyDistributionChart'].data.datasets[0].data = data;
        this.charts['specialtyDistributionChart'].data.datasets[0].backgroundColor = backgroundColors;
        this.charts['specialtyDistributionChart'].data.datasets[0].borderColor = borderColors;
        this.charts['specialtyDistributionChart'].update();
      }

      if (this.charts['genderDistributionChart']) {

        const doctorMale = this.genderDistribution.doctors.male;
        const doctorFemale = this.genderDistribution.doctors.female;
        const doctorOther = this.genderDistribution.doctors.other;

        const patientMale = this.genderDistribution.patients.male;
        const patientFemale = this.genderDistribution.patients.female;
        const patientOther = this.genderDistribution.patients.other;

        this.charts['genderDistributionChart'].data.datasets[0].data = [doctorMale, doctorFemale, doctorOther];
        this.charts['genderDistributionChart'].data.datasets[1].data = [patientMale, patientFemale, patientOther];
        this.charts['genderDistributionChart'].update();
      }
    } catch (error) {
      console.error("Error al actualizar gráficos:", error);
    }
  }

  private initSpecialtyDistributionChart(): void {
    const ctx = document.getElementById('specialtyDistributionChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("No se encontró el elemento canvas para el gráfico de especialidades");
      return;
    }

    const initialData = this.doctorsBySpecialty.length > 0
      ? this.doctorsBySpecialty.slice(0, 5).map(item => item.count)
      : [1, 1, 1, 1, 1];

    const initialLabels = this.doctorsBySpecialty.length > 0
      ? this.doctorsBySpecialty.slice(0, 5).map(item => item.specialty)
      : ['Cargando datos...'];

    this.charts['specialtyDistributionChart'] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: initialLabels,
        datasets: [{
          data: initialData,
          backgroundColor: [
            'rgba(66, 153, 225, 0.8)',
            'rgba(236, 201, 75, 0.8)',
            'rgba(72, 187, 120, 0.8)',
            'rgba(237, 137, 54, 0.8)',
            'rgba(159, 122, 234, 0.8)'
          ],
          borderColor: [
            'rgba(66, 153, 225, 1)',
            'rgba(236, 201, 75, 1)',
            'rgba(72, 187, 120, 1)',
            'rgba(237, 137, 54, 1)',
            'rgba(159, 122, 234, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            align: 'center',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
          title: {
            display: true,
            text: 'Distribución por especialidad',
            padding: {
              top: 10,
              bottom: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
                const percentage = Math.round((value as number / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private initGenderDistributionChart(): void {
    const ctx = document.getElementById('genderDistributionChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("No se encontró el elemento canvas para el gráfico de género");
      return;
    }

    const doctorData = [
      this.genderDistribution.doctors.male || 0,
      this.genderDistribution.doctors.female || 0,
      this.genderDistribution.doctors.other || 0
    ];

    const patientData = [
      this.genderDistribution.patients.male || 0,
      this.genderDistribution.patients.female || 0,
      this.genderDistribution.patients.other || 0
    ];

    this.charts['genderDistributionChart'] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Masculino', 'Femenino', 'Otro'],
        datasets: [
          {
            label: 'Médicos',
            data: doctorData,
            backgroundColor: 'rgba(66, 153, 225, 0.7)',
            borderColor: 'rgba(66, 153, 225, 1)',
            borderWidth: 1
          },
          {
            label: 'Pacientes',
            data: patientData,
            backgroundColor: 'rgba(236, 201, 75, 0.7)',
            borderColor: 'rgba(236, 201, 75, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de personas'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Género'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Distribución por género'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    });
  }

  downloadTopDoctorsReport(): void {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Sistema de Reportes SaludPlus', 105, 15, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Reporte de Médicos Más Activos', 105, 25, { align: 'center' });

      const today = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generado: ${today}`, 105, 30, { align: 'center' });

      const tableColumn = ["Ranking", "Médico", "Especialidad", "Pacientes", "Citas"];
      const tableRows = this.filteredTopDoctors.map((doctor, index) => [
        (index + 1).toString(),
        doctor.name,
        doctor.specialty,
        doctor.patientsCount,
        doctor.appointmentsCount
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 153, 225] }
      });

      doc.save(`reporte_doctores_activos_${today.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Error al generar el reporte. Verifique la consola para más detalles.");
    }
  }

  downloadSpecialtyReport(): void {
    try {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Sistema de Reportes SaludPlus', 105, 15, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Reporte de Distribución por Especialidad', 105, 25, { align: 'center' });

      const today = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Generado: ${today}`, 105, 30, { align: 'center' });

      const tableColumn = ["Especialidad", "Número de Médicos", "Porcentaje"];

      const totalDoctorsSpecialties = this.doctorsBySpecialty.reduce((sum, item) => sum + item.count, 0);

      const tableRows = this.doctorsBySpecialty.map(item => [
        item.specialty,
        item.count.toString(),
        `${((item.count / totalDoctorsSpecialties) * 100).toFixed(1)}%`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 153, 225] }
      });

      doc.save(`reporte_especialidades_${today.replace(/\//g, '-')}.pdf`);
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      alert("Error al generar el reporte. Verifique la consola para más detalles.");
    }
  }

  protected readonly download = Download;
  protected readonly fileText = FileText;
  protected readonly users = Users;
}