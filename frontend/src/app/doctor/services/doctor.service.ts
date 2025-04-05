import { DataDoctorResponse, PendingAppointmentResponse, CancelAndCompleteAppointmentResponse, CancelAppointmentBody, AcceptAppointmentBody, AppointmentHistoryBody, AppointmentHistoryResponse, UpdateDoctorData, SchedulesResponse, DoctorScheduleBody, DoctorScheduleResponse } from "../models/doctor.model";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class DoctorService {
    constructor(private http: HttpClient) { }

    public getDataDoctor(id: number): Observable<DataDoctorResponse> {
        return this.http.get<DataDoctorResponse>(`${environment.apiUrl}/employee/doctor/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getPendintgAppointments(id: number): Observable<PendingAppointmentResponse[]> {
        return this.http.get<PendingAppointmentResponse[]>(`${environment.apiUrl}/employee/pendiente/appointment/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public acceptAppointment(id: number, body: AcceptAppointmentBody): Observable<CancelAndCompleteAppointmentResponse> {
        return this.http.put<CancelAndCompleteAppointmentResponse>(`${environment.apiUrl}/employee/complete/appointment/${id}`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    public cancelAppointment(id: number, body: CancelAppointmentBody): Observable<CancelAndCompleteAppointmentResponse> {
        return this.http.delete<CancelAndCompleteAppointmentResponse>(`${environment.apiUrl}/employee/cancel/appointment/${id}`, { body })
            .pipe(
                catchError(this.handleError)
            );
    }

    public getAppointmentHistory(id: number, body: AppointmentHistoryBody): Observable<AppointmentHistoryResponse[]> {
        return this.http.post<AppointmentHistoryResponse[]>(`${environment.apiUrl}/employee/history/appointments/${id}`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    public setDoctorSchedule(id: number, body: DoctorScheduleBody): Observable<DoctorScheduleResponse> {
        return this.http.post<DoctorScheduleResponse>(`${environment.apiUrl}/employee/scheduled/${id}`, body)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getSchedules(id: number): Observable<SchedulesResponse[]> {
        return this.http.get<SchedulesResponse[]>(`${environment.apiUrl}/employee/scheduled/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public updateDoctor(id: number, doctorData: UpdateDoctorData) {
        const formData = new FormData();

        formData.append('first_name', doctorData.first_name);
        formData.append('last_name', doctorData.last_name);
        formData.append('birth_date', doctorData.birth_date);
        formData.append('gender', doctorData.gender);
        formData.append('phone', doctorData.phone);
        formData.append('address', doctorData.address);

        if (doctorData.photo) {
            formData.append('photo', doctorData.photo, doctorData.photo.name);
        }

        return this.http.put<DataDoctorResponse>(`${environment.apiUrl}/employee/update/doctor/${id}`, formData)
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