export interface DataDoctorResponse {
    id: number;
    firstName: string;
    lastName: string;
    birht_date: string;
    gender: string;
    phone: string;
    photo: string;
    addres: string;
}

export interface PendingAppointmentResponse {
    id: number;
    appointment_date: string;
    reason: string;
    status: string;
    treatment: string | null;
    cancellation_reason: string | null;
    patient: {
        id: number;
        insurance_number: string;
        person: {
            id: number;
            first_name: string;
            last_name: string;
            national_id: string;
            email: string;
            birth_date: string;
            gender: string;
            phone: string;
            photo: string | null;
            address: string;
        }
    }
}

export interface AcceptAppointmentBody {
    treatment: string;
    doctor_id: number;
}

export interface CancelAppointmentBody {
    reason: string;
    apology: string;
    doctor_id: number;
}

export interface CancelAndCompleteAppointmentResponse {
    message: string;
}

export interface AppointmentHistoryBody {
    status: string;
    startDate: string;
    endDate: string;
}

export interface AppointmentHistoryResponse {
    id: number;
    appointment_date: string;
    reason: string;
    status: string;
    treatment: string | null;
    cancellation_reason: string | null;
    patient: {
        id: number;
        insurance_number: string;
        person: {
            id: number;
            first_name: string;
            last_name: string;
            national_id: string;
            email: string;
            birth_date: string;
            gender: string;
            phone: string;
            photo: string | null;
            address: string;
        }
    }
}

export interface UpdateDoctorData {
    first_name: string;
    last_name: string;
    birth_date: string;
    gender: string;
    phone: string;
    address: string;
    photo: File | null;
}