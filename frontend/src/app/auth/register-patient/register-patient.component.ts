import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { UserCircle2 } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-patient',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register-patient.component.html',
  styleUrl: './register-patient.component.css'
})

export class RegisterPatientComponent implements OnInit {
  registerPatientForm!: FormGroup;
  submitted = false;
  profileImageUrl: SafeUrl | null = null;
  selectedFile: File | null = null;
  maxDate: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = eighteenYearsAgo.toISOString().split('T')[0];

    this.registerPatientForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      dpi: ['', [
        Validators.required,
        Validators.minLength(13),
        Validators.maxLength(13),
        Validators.pattern(/^[0-9]+$/)
      ]],
      genre: ['', [Validators.required]],
      birthdate: ['', [Validators.required]], 
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
      ]]
    }, { validators: this.validateBirthdate });

    this.registerPatientForm.valueChanges.subscribe(() => {
      if (this.anyControlTouched()) {
        this.cdr.detectChanges();
      }
    });
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
    return Object.keys(this.registerPatientForm.controls).some(
      key => this.registerPatientForm.get(key)?.touched
    );
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.registerPatientForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerPatientForm.get(fieldName);
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
      }
    };

    if (fieldName === 'birthdate' && this.registerPatientForm.hasError('underage')) {
      return 'Debes ser mayor de edad para registrarte';
    }

    const errorType = Object.keys(field.errors).find(error =>
      errorMessages[fieldName]?.[error]
    );

    return errorType ? errorMessages[fieldName][errorType] : '';
  }

  onSubmit(): void {
    this.submitted = true;

    Object.keys(this.registerPatientForm.controls).forEach(key => {
      const control = this.registerPatientForm.get(key);
      control?.markAsTouched();
    });

    this.cdr.detectChanges();

    if (this.registerPatientForm.invalid) {
      return;
    }

    const formData = new FormData();

    Object.keys(this.registerPatientForm.value).forEach(key => {
      formData.append(key, this.registerPatientForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile, this.selectedFile.name);
    }

    console.log('Registro completado');
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  protected readonly UserCircle2 = UserCircle2;
}