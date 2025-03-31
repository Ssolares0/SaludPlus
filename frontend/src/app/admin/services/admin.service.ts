import { PendingPatientsResponse, PendingDoctorsResponse, ActivePatientsResponse, AcceptUserResponse, RejectUserResponse } from "../models/admin.models";
import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class AdminService {
    private readonly baseUrl = 'http://localhost:3001';

    constructor(private http: HttpClient) { }

    public getPendingPatients(): Observable<PendingPatientsResponse[]> {
        return this.http.get<PendingPatientsResponse[]>(`${this.baseUrl}/admin/pending/patients`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getPendingDoctors(): Observable<PendingDoctorsResponse[]> {
        return this.http.get<PendingDoctorsResponse[]>(`${this.baseUrl}/admin/pending/doctors`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public getActivePatients(): Observable<ActivePatientsResponse[]> {
        return this.http.get<ActivePatientsResponse[]>(`${this.baseUrl}/admin/active/patients`)
            .pipe(
                catchError(this.handleError)
            );
    }

    public acceptUser(id: number): Observable<AcceptUserResponse> {
        return this.http.put<AcceptUserResponse>(`${this.baseUrl}/auth/admin/approved/${id}`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    public rejectUser(id: number): Observable<RejectUserResponse> {
        return this.http.delete<RejectUserResponse>(`${this.baseUrl}/admin/delete/user`, {
            body: { id }
        }).pipe(
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