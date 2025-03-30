export interface PendingPatientsResponse {
    id: number;
    firstame: string; 
    lastName: string;
    birht_date: string;
    gender: string;
    phone: string;
    photo: string | null;
    addres: string;
}

export interface AcceptUserResponse {
    message: string;
    success: boolean;
}