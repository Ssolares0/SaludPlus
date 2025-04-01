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
    role: {
        id: number;
        name: string;
    };
    userId: number;
    token: string;
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
}

export type LoginResponseUnion = LoginResponse | LoginAdminResponse;
