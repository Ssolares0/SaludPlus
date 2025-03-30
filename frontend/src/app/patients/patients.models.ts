export interface ScheduleRequest {
    doctorId: string;
    date: string;
}

export interface Doctor {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string[];
    locacion: string[];
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