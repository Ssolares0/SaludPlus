export interface LoginBody {
    email: string;
    password: string;
}

export interface LoginAdminResponse {
    token: string;
    requiresAuth2: boolean;
}

export interface AdminAuth2Response {
    success: boolean;
    message?: string;
    token?: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    role: string;
    userId: number;
    peopleId: number;
    token: string;
    patientId: number | null;
    doctorId: number | null;
}

export interface RegisterResponse {
    success: boolean;
    userId: number;
}

export interface PatientRegisterData {
    firstName: string;
    lastName: string;
    dpi: string;
    email: string;
    password: string;
    birth_date: string;
    gender: string;
    phone: string;
    address: string;
    role_id: number;
    photo?: File;
    document?: File;
}

export interface DoctorRegisterData {
    firstName: string;
    lastName: string;
    dpi: string;
    email: string;
    password: string;
    birth_date: string;       
    gender: string;           
    phone: string;
    address: string;
    role_id: number;           
    employee_number: string;
    id_specialty: number;
    name_department: string;
    direccion_departamento: string;  
    photo: File;      
    document: File;        
}

export interface ValidateEmailBody {
    token: string;  
    token_email: string;
}

export interface ValidateEmailResponse {
    
}

export type LoginResponseUnion = LoginResponse | LoginAdminResponse;
