import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef 
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

    console.log('Formulario enviado', this.loginForm.value);
  }

  goToSelectTypeAccount() {
    this.router.navigate(['/select-type-account']);
  }
}