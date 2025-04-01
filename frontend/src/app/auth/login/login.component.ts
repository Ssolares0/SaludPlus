import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginBody } from '../models/auth.models';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, LucideAngularModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  isAdmin = false;

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

    this.loginForm.valueChanges.subscribe(() => {
      if (this.anyControlTouched()) {
        this.cdr.detectChanges();
      }
    });
  }

  anyControlTouched(): boolean {
    return Object.keys(this.loginForm.controls).some(
      key => this.loginForm.get(key)?.touched
    );
  }

  shouldShowError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (fieldName === 'email') {
      if (field.errors['required']) return 'El correo electrónico es requerido';
      if (field.errors['email'] || field.errors['pattern']) return 'Ingrese un correo electrónico válido';
    }

    if (fieldName === 'password') {
      if (field.errors['required']) return 'La contraseña es requerida';
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
        else if (this.authService.isStandardResponse(response)) {
          if (response.success) {
            localStorage.setItem('userRoleName', response.role);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId.toString());

            switch (response.role) {
              case 'doctor': 
                localStorage.setItem('doctorId', response.doctorId?.toString() || '');
                this.showSuccessModal("¡Autenticación completada exitosamente!")
                setTimeout(() => {
                  this.router.navigate(['/doctor/appointments']);
                }, 1500);
                break;
              case 'paciente':
                localStorage.setItem('patientId', response.patientId?.toString() || '');
                this.showSuccessModal("¡Autenticación completada exitosamente!")
                setTimeout(() => {
                  this.router.navigate(['/patients']);
                }, 1500);
                break;
            }
          } else {
            this.showErrorModal(response.message || 'Credenciales incorrectas');
          }
        }
        else {
          console.error('Formato de respuesta no reconocido:', response);
          this.showErrorModal('Error inesperado en la respuesta del servidor');
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

  cancelAdminAuth(): void {
    localStorage.removeItem('isAdmin');
    this.isAdmin = false;
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  goToSelectTypeAccount() {
    this.router.navigate(['/select-type-account']);
  }

  protected readonly ArrowLeft = ArrowLeft;
}