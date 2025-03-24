import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginBody } from '../models/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  isLoading = false;
  isAdmin = false;

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

          if (response.requiresAuth2) {
            this.isAdmin = true;
          }
        }
        else if (this.authService.isStandardResponse(response)) {
          if (response.success) {
            localStorage.setItem('userRole', response.role.id.toString());
            localStorage.setItem('userRoleName', response.role.name);

            switch (response.role.name) {
              case 'doctor': 
                this.router.navigate(['/doctor/dashboard']);
                break;
              case 'patient':
                this.router.navigate(['/patient/dashboard']);
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
        this.showErrorModal('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    });
  }

  private showErrorModal(message: string) {
    this.modalType = 'error';
    this.modalTitle = '¡Error al iniciar sesión!';
    this.modalMessage = message;
    this.showModal = true;
  }

  onCloseModal(): void {
    this.showModal = false;
  }

  goToSelectTypeAccount() {
    this.router.navigate(['/select-type-account']);
  }
}