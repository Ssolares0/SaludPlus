import { Doctor } from "./patients.models";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3001';

    constructor(private http: HttpClient) { }

    public getAvailableDoctors(patientId: number): Observable<Doctor[]> {
        return this.http.get<Doctor[]>(`${this.apiUrl}/patient/doctors/${patientId}`).pipe(
            map(response => {
                console.log('Respuesta del servidor:', response);
                return response;
            }),
            catchError(this.handleError)
        );
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