import { PatientReportResponse, DoctorReportResponse, PendingPatientsResponse, PendingDoctorsResponse, ActivePatientsResponse, ActiveDoctorsResponse, AcceptUserResponse, RejectUserResponse, StatisticsBody, StatisticsResponse } from "../models/admin.models";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AdminService {

    constructor(private http: HttpClient) { }

    public getPendingPatients(): Observable<PendingPatientsResponse[]> {
        return this.http.get<PendingPatientsResponse[]>(`${environment.apiUrl}/admin/pending/patients`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getPendingDoctors(): Observable<PendingDoctorsResponse[]> {
        return this.http.get<PendingDoctorsResponse[]>(`${environment.apiUrl}/admin/pending/doctors`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getActivePatients(): Observable<ActivePatientsResponse[]> {
        return this.http.get<ActivePatientsResponse[]>(`${environment.apiUrl}/admin/active/patients`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getActiveDoctors(): Observable<ActiveDoctorsResponse[]> {
        return this.http.get<ActiveDoctorsResponse[]>(`${environment.apiUrl}/admin/active/doctors`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public acceptUser(id: number): Observable<AcceptUserResponse> {
        return this.http.put<AcceptUserResponse>(`${environment.apiUrl}/auth/admin/approved/${id}`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    public rejectUser(id: number): Observable<RejectUserResponse> {
        return this.http.delete<RejectUserResponse>(`${environment.apiUrl}/admin/delete/user`, { body: { id } })
            .pipe(
                catchError(this.handleError)
            );
    }

    public getStatistics(specialty?: StatisticsBody): Observable<StatisticsResponse[]> {
        let params = new HttpParams();

        if (specialty && specialty.specialty) {
            params = params.set('specialty', specialty.specialty);
        }

        return this.http.get<StatisticsResponse[]>(`${environment.apiUrl}/admin/report/topDoctor`, { params })
            .pipe(
                catchError(this.handleError)
            );
    }

    public getPatientsReport(): Observable<PatientReportResponse[]> {
        return this.http.get<PatientReportResponse[]>(`${environment.apiUrl}/admin/report/againts/patient`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getDoctorsReport(): Observable<DoctorReportResponse[]> {
        return this.http.get<DoctorReportResponse[]>(`${environment.apiUrl}/admin/report/againts/doctor`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public confirmReport(id: number): Observable<any> {
        return this.http.delete(`${environment.apiUrl}/admin/report/delete/${id}`)
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
        }

        console.error('Error completo:', error);
        return throwError(() => new Error(errorMessage));
    }
}