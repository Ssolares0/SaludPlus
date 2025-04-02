import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../admin/services/admin.service';
import { ActiveDoctorsResponse } from '../../admin/models/admin.models';
import { SafeImagePipe } from '../../core/pipes/safe-image.pipe';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DoctorService } from '../services/doctor.service';
import { UpdateDoctorData } from '../models/doctor.model';
import { ModalComponent } from '../../core/components/modal/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SafeImagePipe,
    ModalComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  profileForm!: FormGroup;

  doctor: ActiveDoctorsResponse | null = null;
  loading = true;
  error: string | null = null;

  photoFile: File | null = null;
  photoPreview: SafeUrl | null = null;
  uploadingPhoto = false;

  showModal = false;
  modalType: 'success' | 'warning' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  specialties = [
    { id: 1, name: 'Medicina General' },
    { id: 2, name: 'Cardiología' },
    { id: 3, name: 'Dermatología' },
    { id: 4, name: 'Pediatría' },
    { id: 5, name: 'Traumatología' },
    { id: 6, name: 'Ginecología' },
    { id: 7, name: 'Neurología' },
    { id: 8, name: 'Oftalmología' }
  ];

  departments = [
    'Guatemala', 'Alta Verapaz', 'Baja Verapaz', 'Chimaltenango',
    'Chiquimula', 'El Progreso', 'Escuintla', 'Huehuetenango',
    'Izabal', 'Jalapa', 'Jutiapa', 'Petén', 'Quetzaltenango',
    'Quiché', 'Retalhuleu', 'Sacatepéquez', 'San Marcos',
    'Santa Rosa', 'Sololá', 'Suchitepéquez', 'Totonicapán', 'Zacapa'
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private doctorService: DoctorService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDoctorProfile();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dpi: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      address: ['', Validators.required],
      collegiateNumber: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      specialty: ['', Validators.required],
      department: ['', Validators.required],
      clinicAddress: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  private loadDoctorProfile(): void {
    const doctorId = Number(localStorage.getItem('userId'));

    if (!doctorId) {
      this.error = 'No se pudo identificar al doctor. Por favor, vuelva a iniciar sesión.';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }

    this.adminService.getActiveDoctors().subscribe({
      next: (doctors) => {
        const doctor = doctors.find(doc => doc.id === doctorId);
        if (doctor) {
          this.doctor = doctor;
          this.populateForm(doctor);
        } else {
          this.error = 'No se encontró información del doctor.';
        }

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Error al cargar el perfil: ' + err.message;
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private populateForm(doctor: ActiveDoctorsResponse): void {
    const specialty = doctor.specialty.length > 0 ?
      doctor.specialty[0].specialty.id.toString() : '';

    const departmentName = doctor.department.length > 0 ?
      doctor.department[0].department.name : '';

    const clinicAddress = doctor.department.length > 0 ?
      doctor.department[0].department.location : '';

    const birthDate = this.formatDateForInput(doctor.birht_date);

    this.profileForm.patchValue({
      firstName: doctor.firstame,
      lastName: doctor.lastName,
      dpi: doctor.dpi,
      birthDate: birthDate,
      gender: doctor.gender,
      phone: doctor.phone,
      address: doctor.addres,
      collegiateNumber: doctor.number_col,
      specialty: specialty,
      department: departmentName,
      clinicAddress: clinicAddress,
      email: 'doctor@example.com' 
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.showErrorModal('Por favor, completa todos los campos requeridos correctamente.');
      return;
    }

    this.uploadingPhoto = true;
    this.cdr.markForCheck();

    const doctorId = Number(localStorage.getItem('userId'));
    if (!doctorId) {
      this.showErrorModal('No se pudo identificar al doctor. Por favor, vuelva a iniciar sesión.');
      this.uploadingPhoto = false;
      this.cdr.markForCheck();
      return;
    }

    const formValues = this.profileForm.getRawValue();

    const updateData: UpdateDoctorData = {
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      birth_date: formValues.birthDate,
      gender: formValues.gender,
      phone: formValues.phone,
      address: formValues.address,
      photo: this.photoFile
    };

    this.doctorService.updateDoctor(doctorId, updateData).subscribe({
      next: (response) => {
        this.uploadingPhoto = false;
        this.showSuccessModal('Perfil actualizado con éxito');
        if (this.doctor) {
          this.doctor.firstame = updateData.first_name;
          this.doctor.lastName = updateData.last_name;
          this.doctor.birht_date = updateData.birth_date;
          this.doctor.gender = updateData.gender;
          this.doctor.phone = updateData.phone;
          this.doctor.addres = updateData.address;
          if (response.photo) {
            this.doctor.photo = response.photo;
          }
        }
        this.photoFile = null;
        this.photoPreview = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.uploadingPhoto = false;
        this.showErrorModal('Error al actualizar el perfil: ' + error.message);
        this.cdr.markForCheck();
      }
    });
  }

  resetForm() {
    if (this.doctor) {
      this.populateForm(this.doctor);
      this.photoPreview = null;
      this.photoFile = null;
      this.cdr.markForCheck();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        this.showWarningModal('Por favor, seleccione una imagen válida (JPEG, PNG o GIF)');
        this.resetFileInput();
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showWarningModal('La imagen no debe exceder 5MB');
        this.resetFileInput();
        return;
      }

      this.photoFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.photoPreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
          this.cdr.markForCheck();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  private resetFileInput() {
    this.photoFile = null;
    this.photoPreview = null;
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
    this.cdr.markForCheck();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['pattern']) {
      if (fieldName === 'dpi') return 'El DPI debe tener 13 dígitos numéricos';
      if (fieldName === 'phone') return 'El teléfono debe tener 8 dígitos numéricos';
      if (fieldName === 'collegiateNumber') return 'El número de colegiado debe tener 6 dígitos numéricos';
    }

    return 'Campo inválido';
  }

  private showSuccessModal(message: string): void {
    this.modalType = 'success';
    this.modalTitle = 'Operación exitosa';
    this.modalMessage = message;
    this.showModal = true;
    this.cdr.markForCheck();
  }

  private showWarningModal(message: string): void {
    this.modalType = 'warning';
    this.modalTitle = 'Advertencia';
    this.modalMessage = message;
    this.showModal = true;
    this.cdr.markForCheck();
  }

  private showErrorModal(message: string): void {
    this.modalType = 'error';
    this.modalTitle = 'Error';
    this.modalMessage = message;
    this.showModal = true;
    this.cdr.markForCheck();
  }

  onCloseModal(): void {
    this.showModal = false;
    this.cdr.markForCheck();
  }
}