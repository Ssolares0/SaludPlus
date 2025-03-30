import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem("token");

    if (token) {
        return true;
    } else {
        router.navigate(['/']);
        return false;
    }
};

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin") === 'true';

    if (token && isAdmin) {
        return true;
    } else {
        router.navigate(['/']);
        return false;
    }
};

export const doctorGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRoleName');

    if (token && userRole === 'doctor') {
        return true;
    } else {
        router.navigate(['']);
        return false;
    }
};

export const patientGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRoleName');

    if (userRole === 'paciente') {
        return true;
    } else {
        router.navigate(['']);
        return false;
    }
};

export const noAuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRoleName');

    if (!token) {
        return true;
    } else {
        if (localStorage.getItem('isAdmin') === 'true') {
            router.navigate(['/admin/reports']);
        } else if (userRole === 'doctor') {
            router.navigate(['/doctor/dashboard']);
        } else if (userRole === 'paciente') {
            router.navigate(['/patient/dashboard']);
        } else {
            localStorage.clear();
            return true;
        }
        return false;
    }
};
