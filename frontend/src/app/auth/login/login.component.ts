import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginBody, ValidateEmailBody, ValidateEmailResponse, LoginResponse } from '../models/auth.models';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { LucideAngularModule, ArrowLeft, Mail } from 'lucide-angular'; // Añadir ícono Mail

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailVerifyForm!: FormGroup;
  submitted = false;
  isLoading = false;
  isAdmin = false;
  requireEmailVerification = false;
  userEmail = '';

  selectedFile: File | null = null;
  selectedFileName: string = '';

  @ViewChild('keyFileInput') keyFileInput!: ElementRef;

  showModal = false;
  modalType: 'success' | 'warning' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const isAdminAuth = localStorage.getItem('isAdmin') === 'true';

    if (isAdminAuth) {
      this.isAdmin = true;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]],
      password: ['', [
        Validators.required,
      ]]
    });

    this.emailVerifyForm = this.formBuilder.group({
      verificationCode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]+$')
      ]]
    });

    this.loginForm.valueChanges.subscribe(() => {
      if (this.anyControlTouched()) {
        this.cdr.detectChanges();
      }
    });

    this.emailVerifyForm.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  anyControlTouched(): boolean {
    return Object.keys(this.loginForm.controls).some(
      key => this.loginForm.get(key)?.touched
    );
  }

  shouldShowError(fieldName: string, form: FormGroup = this.loginForm): boolean {
    const field = form.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  getErrorMessage(fieldName: string, form: FormGroup = this.loginForm): string {
    const field = form.get(fieldName);
    if (!field || !field.errors) return '';

    if (fieldName === 'email') {
      if (field.errors['required']) return 'El correo electrónico es requerido';
      if (field.errors['email'] || field.errors['pattern']) return 'Ingrese un correo electrónico válido';
    }

    if (fieldName === 'password') {
      if (field.errors['required']) return 'La contraseña es requerida';
    }

    if (fieldName === 'verificationCode') {
      if (field.errors['required']) return 'El código de verificación es requerido';
      if (field.errors['minlength'] || field.errors['maxlength']) return 'El código debe tener 6 dígitos';
      if (field.errors['pattern']) return 'El código debe contener solo números';
    }

    return '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  submitAdminAuth(event: Event): void {
    event.preventDefault();

    if (!this.selectedFile) {
      this.showErrorModal('Por favor, selecciona un archivo');
      return;
    }

    this.isLoading = true;

    this.authService.loginAdmin(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (response.success) {
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          this.showSuccessModal('¡Autenticación completada exitosamente!');

          setTimeout(() => {
            this.router.navigate(['/admin/reports']);
          }, 1500);
        } else {
          this.showErrorModal(response.message || 'Error al autenticar como administrador');
        }
      },
      error: (error) => {
        console.error('Error al autenticar como administrador:', error);
        this.isLoading = false;
        this.showErrorModal('El archivo de autenticación no es válido o hubo un error en el servidor. Por favor, intente de nuevo.');
      }
    })
  }

  submitEmailVerification() {
    if (this.emailVerifyForm.invalid) {
      Object.keys(this.emailVerifyForm.controls).forEach(key => {
        const control = this.emailVerifyForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const verificationBody: ValidateEmailBody = {
      token: localStorage.getItem('tempToken') || '',
      token_email: this.emailVerifyForm.value.verificationCode
    };

    this.authService.validateEmail(verificationBody).subscribe({
      next: (response: ValidateEmailResponse) => {
        this.isLoading = false;

        if (response.success) {
          localStorage.removeItem('tempToken');
          localStorage.setItem('userRoleName', response.role);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId.toString());

          switch (response.role) {
            case 'doctor':
              localStorage.setItem('doctorId', response.doctorId?.toString() || '');
              this.showSuccessModal("¡Verificación de email exitosa! Redirigiendo al panel de doctor.");
              setTimeout(() => {
                this.router.navigate(['/doctor/appointments']);
              }, 1500);
              break;
            case 'paciente':
              localStorage.setItem('patientId', response.patientId?.toString() || '');
              this.showSuccessModal("¡Verificación de email exitosa! Redirigiendo al panel de paciente.");
              setTimeout(() => {
                this.router.navigate(['/patients']);
              }, 1500);
              break;
            default:
              this.showWarningModal("Cuenta verificada pero el rol no es reconocido.");
              break;
          }
        } else {
          this.showErrorModal(response.message || 'Error al verificar el código');
        }
      },
      error: (error) => {
        console.error('Error al verificar email:', error);
        this.isLoading = false;
        this.showErrorModal('El código proporcionado no es válido o ha expirado. Por favor, intente de nuevo.');
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });

    this.cdr.detectChanges();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    const loginBody: LoginBody = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.Login(loginBody).subscribe({
      next: (response) => {
        this.isLoading = false;

        if (this.authService.isAdminResponse(response)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isAdmin', 'true');

          if (response.requiresAuth2) {
            this.isAdmin = true;
          }
        }
        else if (this.authService.isEmailVerificationResponse(response)) {
          localStorage.setItem('tempToken', response.token);

          this.requireEmailVerification = true;
          this.userEmail = this.loginForm.value.email;

          this.showWarningModal('Por favor, verifica tu email antes de continuar. Se ha enviado un código de verificación a tu correo.');
        }
        else if (this.authService.isStandardResponse(response)) {
          const standardResponse = response as LoginResponse;

          if (standardResponse.success) {
            localStorage.setItem('userRoleName', standardResponse.role);
            localStorage.setItem('token', standardResponse.token);
            localStorage.setItem('userId', standardResponse.userId.toString());

            switch (standardResponse.role) {
              case 'doctor':
                localStorage.setItem('doctorId', standardResponse.doctorId?.toString() || '');
                this.showSuccessModal("¡Autenticación completada exitosamente!")
                setTimeout(() => {
                  this.router.navigate(['/doctor/appointments']);
                }, 1500);
                break;
              case 'paciente':
                localStorage.setItem('patientId', standardResponse.patientId?.toString() || '');
                this.showSuccessModal("¡Autenticación completada exitosamente!")
                setTimeout(() => {
                  this.router.navigate(['/patients']);
                }, 1500);
                break;
            }
          } else {
            this.showErrorModal(standardResponse.message || 'Credenciales incorrectas');
          }
        }
        else {
          console.error('Formato de respuesta no reconocido:', response);
          this.showErrorModal('Error inesperado en la respuesta del servidor, credenciales incorrectas o tu cuenta no ha sido activada.');
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        this.isLoading = false;
        this.showErrorModal('Ocurrió un error al iniciar sesión. Por favor verifica tus credenciales e intenta de nuevo.');
      }
    });
  }

  private showSuccessModal(message: string): void {
    this.modalType = 'success';
    this.modalTitle = '¡Autenticación exitosa!';
    this.modalMessage = message;
    this.showModal = true;
  }

  private showErrorModal(message: string) {
    this.modalType = 'error';
    this.modalTitle = '¡Error al iniciar sesión!';
    this.modalMessage = message;
    this.showModal = true;
  }

  private showWarningModal(message: string) {
    this.modalType = 'warning';
    this.modalTitle = '¡Advertencia!';
    this.modalMessage = message;
    this.showModal = true;
  }

  cancelAdminAuth(): void {
    localStorage.removeItem('isAdmin');
    this.isAdmin = false;
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  cancelEmailVerification(): void {
    localStorage.removeItem('tempToken');
    this.requireEmailVerification = false;
    this.userEmail = '';
    this.emailVerifyForm.reset();
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  goToSelectTypeAccount() {
    this.router.navigate(['/select-type-account']);
  }

  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Mail = Mail;
}