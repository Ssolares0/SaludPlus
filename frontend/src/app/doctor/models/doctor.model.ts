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