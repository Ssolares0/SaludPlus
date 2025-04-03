export interface ScheduleRequest {
    doctorId: string;
    date: string;
}

export interface Doctor {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    foto: string;
    doctorId: string;
    especialidad: string[];
    locacion?: string[]; 
}

export interface DoctorResponse {
    error: boolean;
    data: Doctor[];
}

export interface DoctorSchedule {
    start_time: string;
    end_time: string;
    day: string;
}

export interface TimeSlot {
    time: string;
    isAvailable: boolean;
}

export interface ScheduleResponse {
    error: boolean;
    data: {
        doctorSchedule: DoctorSchedule;
        availability: TimeSlot[];
        date: string;
    }
}

export interface ScheduleRequest {
    doctorId: string;
    date: string;
}

export interface ActiveAppointment {
    id: number;
    fecha: string;
    motivo: string;
    estado: string;
    doctor: {
        id: number;
        nombre: string;
        apellido: string;
    };
    paciente: {
        id: number;
        nombre: string;
        apellido: string;
    };
}

export interface ActiveAppointmentsResponse {
    error: boolean;
    message?: string;
    data: ActiveAppointment[];
}

export interface AppointmentBody {
    date: string;
    hour: string;
    motive: string;
    doctorId: string;
}
