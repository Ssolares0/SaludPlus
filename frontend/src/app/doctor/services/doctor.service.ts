import { DataDoctorResponse, PendingAppointmentResponse } from "../models/doctor.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DoctorService {
    private readonly baseUrl = 'http://localhost:3001';

    constructor(private http: HttpClient) { }

    public getDataDoctor(id: number): Observable<DataDoctorResponse> {
        return this.http.get<DataDoctorResponse>(`${this.baseUrl}/employee/doctor/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getPendintgAppointments(id: number): Observable<PendingAppointmentResponse[]> {
        return this.http.get<PendingAppointmentResponse[]>(`${this.baseUrl}/employee/pendiente/appointment/${id}`)
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