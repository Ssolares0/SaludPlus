import { PendingPatientsResponse, AcceptUserResponse } from "../models/admin.models";
import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import { catchError, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
    
})

export class AdminService {
    constructor(private http: HttpClient) { }

    public getPendingPatients(): Observable<PendingPatientsResponse[]> {
        return this.http.get<PendingPatientsResponse[]>('http://localhost:3001/admin/pending/patients')
            .pipe(
                catchError(this.handleError)
            );
    }

    public acceptUser(id: number): Observable<AcceptUserResponse> {
        return this.http.put<AcceptUserResponse>(`http://localhost:3001/auth/admin/approved/${id}`, {})
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