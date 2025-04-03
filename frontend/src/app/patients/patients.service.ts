import { Doctor, ScheduleResponse, ActiveAppointmentsResponse, ScheduleRequest, AppointmentBody } from "./patients.models";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PatientsService {
    private apiUrl = 'http://localhost:3001';

    constructor(private http: HttpClient) { }

    public getAvailableDoctors(patientId: number): Observable<Doctor[]> {
        return this.http.get<any>(`${this.apiUrl}/patient/doctors/${patientId}`).pipe(
            map(response => {
                console.log('Respuesta del servidor:', response);
                if (response && !response.error && Array.isArray(response.data)) {
                    return response.data;
                }
                return [];
            }),
            catchError(this.handleError)
        );
    }

    public getDoctorsBySpeciality(speciality: string): Observable<Doctor[]> {
        return this.http.post<any>(`${this.apiUrl}/patient/doctors-speciality`, { speciality }).pipe(
            map(response => {
                console.log('Respuesta del servidor para especialidad:', response);
                if (response && !response.error && Array.isArray(response.data)) {
                    return response.data;
                }
                return [];
            }),
            catchError(this.handleError)
        );
    }

    public getDoctorSchedule(doctorId: string, date: string): Observable<ScheduleResponse> {
        const payload: ScheduleRequest = {
            doctorId: String(doctorId),
            date: date
        };

        console.log('Payload a enviar:', payload);

        return this.http.post<ScheduleResponse>(`${this.apiUrl}/patient/schedule`, payload)
            .pipe(
                map(response => {
                    console.log('Respuesta del servidor:', response);

                    if (response && response.data) {
                        return response;
                    } else {
                        throw new Error('No hay datos de horario disponibles');
                    }
                }),
                catchError(this.handleError)
            );
    }

    public getActiveAppointments(patientId: number): Observable<ActiveAppointmentsResponse> {
        return this.http.get<ActiveAppointmentsResponse>(
            `${this.apiUrl}/patient/appointment-actives/${patientId}`
        ).pipe(
            map(response => {
                console.log('Citas activas:', response);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    public createAppointment(patientId: number, appointment: AppointmentBody): Observable<ActiveAppointmentsResponse> {
        console.log('Payload a enviar para crear cita:', appointment);

        return this.http.post<ActiveAppointmentsResponse>(`${this.apiUrl}/patient/appointment/${patientId}`, appointment)
            .pipe(
                map(response => {
                    console.log('Respuesta del servidor al crear cita:', response);
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    public cancelAppointment(appointmentId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/patient/cancel-appointment/${appointmentId}`)
            .pipe(
                map(response => {
                    console.log('Respuesta del servidor al cancelar cita:', response);
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    private formatDateToString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
            errorMessage = `Error del servidor: ${error.status}, mensaje: ${error.message}`;
        }
        console.error('Error completo:', error);
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}