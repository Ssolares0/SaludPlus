import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { UserCircle2 } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DoctorRegisterData } from '../models/auth.models';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-doctor.component.html',
  styleUrl: './register-doctor.component.css'
})

export class RegisterDoctorComponent implements OnInit {
  registerDoctorForm!: FormGroup;
  submitted = false;
  profileImageUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  maxDate: string = '';
  isLoading = false;
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

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = eighteenYearsAgo.toISOString().split('T')[0];

    this.registerDoctorForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      dpi: ['', [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]+$/)
      ]],
      birthdate: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      direction: ['', [Validators.required]],
      phone: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^[0-9]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/)
      ]],
      collegiateNumber: ['', [
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(6),
        Validators.pattern(/^[0-9]+$/)
      ]],
      specialty: ['', [Validators.required]],
      clinicAddress: ['', [Validators.required]],
      department: ['', [Validators.required]]
    }, { validators: this.validateBirthdate });

    this.registerDoctorForm.valueChanges.subscribe(() => {
      if (this.anyControlTouched()) {
        this.cdr.detectChanges();
      }
    });
  }

  private getGenderValue(genre: string): string {
    switch (genre) {
      case 'masculino':
        return '1';
      case 'femenino':
        return '0';
      case 'otro':
        return '3';
      default:
        return '1';
    }
  }

  private formatBirthdate(date: string): string {
    const birthDate = new Date(date);
    const day = String(birthDate.getDate()).padStart(2, '0');
    const month = String(birthDate.getMonth() + 1).padStart(2, '0');
    const year = birthDate.getFullYear();

    return `${month}-${day}-${year}`;
  }

  validateBirthdate(group: FormGroup) {
    const birthdateControl = group.get('birthdate');
    if (!birthdateControl || !birthdateControl.value) return null;

    const birthdate = new Date(birthdateControl.value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const m = today.getMonth() - birthdate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      if (age - 1 < 18) {
        return { underage: true };
      }
    } else {
      if (age < 18) {
        return { underage: true };
      }
    }

    return null;
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      if (!this.validateImageType(this.selectedFile)) {
        alert('Por favor seleccione un archivo de imagen válido (JPG, PNG o GIF).');
        this.resetProfileImage();
        return;
      }

      if (this.selectedFile.size > 5 * 1024 * 1024) {
        alert('La imagen no debe exceder los 5MB.');
        this.resetProfileImage();
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  validateImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    return validTypes.includes(file.type);
  }

  resetProfileImage(): void {
    this.profileImageUrl = null;
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
  }

  anyControlTouched(): boolean {
    return Object.keys(this.registerDoctorForm.controls).some(
      key => this.registerDoctorForm.get(key)?.touched
    );
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.registerDoctorForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerDoctorForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errorMessages: Record<string, Record<string, string>> = {
      name: {
        required: 'El nombre es requerido'
      },
      lastname: {
        required: 'El apellido es requerido'
      },
      dpi: {
        required: 'El DPI es requerido',
        minlength: 'El DPI debe tener 13 dígitos',
        maxlength: 'El DPI debe tener 13 dígitos',
        pattern: 'El DPI solo debe contener números'
      },
      birthdate: {
        required: 'La fecha de nacimiento es requerida',
        underage: 'Debes ser mayor de edad para registrarte'
      },
      genre: {
        required: 'El género es requerido'
      },
      direction: {
        required: 'La dirección es requerida'
      },
      phone: {
        required: 'El teléfono es requerido',
        minlength: 'El teléfono debe tener 8 dígitos',
        maxlength: 'El teléfono debe tener 8 dígitos',
        pattern: 'El teléfono solo debe contener números'
      },
      email: {
        required: 'El correo electrónico es requerido',
        email: 'Ingrese un correo electrónico válido',
        pattern: 'Ingrese un correo electrónico válido'
      },
      password: {
        required: 'La contraseña es requerida',
        minlength: 'La contraseña debe tener al menos 8 caracteres',
        pattern: 'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial'
      },
      collegiateNumber: {
        required: 'El número de colegiado es requerido',
        pattern: 'El número de colegiado solo debe contener números',
        minlength: 'El número de colegiado debe tener 6 dígitos',
        maxlength: 'El número de colegiado debe tener 6 dígitos'
      },
      specialty: {
        required: 'La especialidad es requerida'
      },
      clinicAddress: {
        required: 'La dirección de la clínica es requerida'
      },
      department: {
        required: 'El departamento es requerido'
      }
    };

    if (fieldName === 'birthdate' && this.registerDoctorForm.hasError('underage')) {
      return 'Debes ser mayor de edad para registrarte';
    }

    const errorType = Object.keys(field.errors).find(error =>
      errorMessages[fieldName]?.[error]
    );

    return errorType ? errorMessages[fieldName][errorType] : '';
  }

  onSubmit(): void {
    this.submitted = true;

    Object.keys(this.registerDoctorForm.controls).forEach(key => {
      const control = this.registerDoctorForm.get(key);
      control?.markAsTouched();
    });

    this.cdr.detectChanges();

    if (this.registerDoctorForm.invalid) {
      return;
    }

    if (!this.selectedFile) {
      alert('Por favor seleccione una foto de perfil (requerida para médicos).');
      return;
    }

    this.isLoading = true;

    const doctorData: DoctorRegisterData = {
      firstName: this.registerDoctorForm.value.name,
      lastName: this.registerDoctorForm.value.lastname,
      dpi: this.registerDoctorForm.value.dpi,
      email: this.registerDoctorForm.value.email,
      password: this.registerDoctorForm.value.password,
      birth_date: this.formatBirthdate(this.registerDoctorForm.value.birthdate),
      gender: this.getGenderValue(this.registerDoctorForm.value.genre),
      phone: this.registerDoctorForm.value.phone,
      address: this.registerDoctorForm.value.direction,
      role_id: 2, 
      employee_number: this.registerDoctorForm.value.collegiateNumber,
      id_specialty: this.getSpecialtyId(this.registerDoctorForm.value.specialty),
      name_department: this.registerDoctorForm.value.department,
      direccion_departamento: this.registerDoctorForm.value.clinicAddress,
      photo: this.selectedFile
    };

    this.authService.registerDoctor(doctorData).subscribe({
      next: (response) => {
        console.log('Registro completado exitosamente', response);
        this.isLoading = false;
        alert('¡Registro completado exitosamente! Tu cuenta será revisada por un administrador antes de ser activada.');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error al registrar', error);
        this.isLoading = false;
        alert('Error al registrar: ' + error.message);
      }
    });
  }

  private getSpecialtyId(specialtyValue: string): number {
    switch (specialtyValue) {
      case 'medicina-general': return 1;
      case 'cardiologia': return 2;
      case 'dermatologia': return 3;
      case 'pediatria': return 4;
      case 'traumatologia': return 5;
      case 'ginecologia': return 6;
      case 'neurologia': return 7;
      case 'oftalmologia': return 8;
      default: return 1; 
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  protected readonly UserCircle2 = UserCircle2;
}