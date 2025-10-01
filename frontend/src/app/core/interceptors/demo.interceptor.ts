import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, delay, throwError } from 'rxjs';
import { demoConfig } from '../config/demo.config';

export const demoInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo interceptar en modo demo
  if (!demoConfig.isDemoMode) {
    return next(req);
  }

  const url = req.url;

  // Interceptar login
  if (url.includes('/auth/login') && req.method === 'POST') {
    const body = req.body as any;
    const user = demoConfig.demoUsers.find(u =>
      u.email === body.email && u.password === body.password
    );

    if (user) {
      let response: any;

      if (user.role === 'admin') {
        response = {
          token: user.token,
          requiresAuth2: user.requiresAuth2
        };
      } else {
        response = {
          success: true,
          role: user.role,
          token: user.token,
          userId: user.userId,
          message: 'Login exitoso'
        };

        if (user.role === 'doctor') {
          response.doctorId = user.doctorId;
        } else if (user.role === 'paciente') {
          response.patientId = user.patientId;
        }
      }

      return of(new HttpResponse({
        status: 200,
        body: response
      })).pipe(delay(500)); // Simular latencia de red
    } else {
      return throwError(() => new HttpResponse({
        status: 401,
        body: { error: { message: 'Credenciales incorrectas' } }
      })).pipe(delay(500));
    }
  }

  // Interceptar otras llamadas de la API en modo demo
  if (url.includes('/api/') || url.includes('localhost:3001') || url.includes('34.170.162.251')) {
    // Devolver datos mock según la ruta
    if (url.includes('/patients')) {
      return of(new HttpResponse({
        status: 200,
        body: { success: true, data: demoConfig.mockData.patients }
      })).pipe(delay(300));
    }

    if (url.includes('/doctors')) {
      return of(new HttpResponse({
        status: 200,
        body: { success: true, data: demoConfig.mockData.doctors }
      })).pipe(delay(300));
    }

    if (url.includes('/appointments')) {
      return of(new HttpResponse({
        status: 200,
        body: { success: true, data: demoConfig.mockData.appointments }
      })).pipe(delay(300));
    }

    // Para otras rutas, devolver una respuesta genérica de éxito
    return of(new HttpResponse({
      status: 200,
      body: { success: true, message: 'Demo mode - Operation simulated' }
    })).pipe(delay(300));
  }

  // Si no coincide con ningún patrón, pasar al siguiente interceptor
  return next(req);
};
