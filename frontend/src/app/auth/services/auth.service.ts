import { LoginBody, LoginResponse, PatientRegisterData, RegisterResponse, DoctorRegisterData, LoginAdminResponse, LoginResponseUnion, AdminAuth2Response } from "../models/auth.models";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    constructor(private http: HttpClient) { }

    public Login(LoginBody: LoginBody): Observable<LoginResponseUnion> {
        return this.http.post<LoginResponseUnion>('http://localhost:3001/auth/login', LoginBody)
            .pipe(
                catchError(this.handleError)
            );
    }

    public loginAdmin(file: File): Observable<AdminAuth2Response> {
        const token = localStorage.getItem('token');

        if (!token) {
            return throwError(() => new Error('No se encontró el token de autenticación'));
        }

        const headers = new HttpHeaders({
            'Authorization': token
        });

        const formData = new FormData();
        formData.append('archivo', file, file.name);

        return this.http.post<AdminAuth2Response>('http://localhost:3001/auth/admin/auth2', formData, {
            headers: headers
        }).pipe(
            catchError(this.handleError)
        );
    }

    public isStandardResponse(response: any): response is LoginResponse {
        return 'success' in response && 'role' in response;
    }

    public isAdminResponse(response: any): response is LoginAdminResponse {
        return 'token' in response && 'requiresAuth2' in response;
    }

    public registerPatient(patientData: PatientRegisterData): Observable<RegisterResponse> {
        const formData = new FormData();

        formData.append('firstName', patientData.firstName);
        formData.append('lastName', patientData.lastName);
        formData.append('dpi', patientData.dpi);
        formData.append('email', patientData.email);
        formData.append('password', patientData.password);
        formData.append('birth_date', patientData.birth_date);
        formData.append('gender', patientData.gender);
        formData.append('phone', patientData.phone);
        formData.append('address', patientData.address);
        formData.append('role_id', patientData.role_id.toString());

        if (patientData.photo) {
            formData.append('photo', patientData.photo, patientData.photo.name);
        }

        return this.http.post<RegisterResponse>('http://localhost:3001/auth/register/patient', formData)
            .pipe(
                catchError(this.handleError)
            );
    }

    public registerDoctor(doctorData: DoctorRegisterData): Observable<RegisterResponse> {
        const formData = new FormData();

        formData.append('firstName', doctorData.firstName);
        formData.append('lastName', doctorData.lastName);
        formData.append('dpi', doctorData.dpi);
        formData.append('email', doctorData.email);
        formData.append('password', doctorData.password);
        formData.append('birth_date', doctorData.birth_date);
        formData.append('gender', doctorData.gender);
        formData.append('phone', doctorData.phone);
        formData.append('address', doctorData.address);
        formData.append('role_id', doctorData.role_id.toString());

        formData.append('employee_number', doctorData.employee_number);
        formData.append('id_specialty', doctorData.id_specialty.toString());
        formData.append('name_department', doctorData.name_department);

        formData.append('direccion_department', doctorData.direccion_departamento);

        if (doctorData.photo) {
            formData.append('photo', doctorData.photo, doctorData.photo.name);
        }

        return this.http.post<RegisterResponse>('http://localhost:3001/auth/register/doctor', formData)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error del lado del cliente: ${error.error.message}`;
        } else {
            const serverError = error.error?.error || error.error?.message || error.statusText;
            errorMessage = `Error del servidor: Código ${error.status}, Mensaje: ${serverError}`;

            console.error('Cuerpo completo del error:', error.error);
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}