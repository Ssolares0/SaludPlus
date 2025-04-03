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

export interface SpecialtyInfo {
    id: number;
    name: string;
    description: string;
}

export interface DoctorSpecialty {
    id: number;
    specialty: SpecialtyInfo;
}

export interface DepartmentInfo {
    id: number;
    name: string;
    location: string;
}

export interface DoctorDepartment {
    id: number;
    department: DepartmentInfo;
}

export interface PendingDoctorsResponse {
    id: number;
    firstame: string;
    lastName: string;
    dpi: string;
    birht_date: string;
    gender: string;
    phone: string;
    photo: string | null;
    addres: string;
    number_col: string;
    specialty: DoctorSpecialty[];
    department: DoctorDepartment[];
}

export interface ActivePatientsResponse {
    id: number;
    firstame: string; 
    lastName: string;
    birht_date: string;
    gender: string;
    phone: string;
    photo: string | null;
    addres: string;
}

export interface ActiveDoctorsResponse {
    id: number;
    firstame: string;
    lastName: string;
    dpi: string;
    birht_date: string;
    gender: string;
    phone: string;
    photo: string | null;
    addres: string;
    number_col: string;
    specialty: DoctorSpecialty[];
    department: DoctorDepartment[];
}

export interface AcceptUserResponse {
    message: string;
    success: boolean;
}

export interface RejectUserResponse {
    message: string;
    success: boolean;
}

export interface StatisticsResponse {
    id: number;
    name: string;
    photo: string | null;
    specialty: string;
    patientsCount: number;
    appointmentsCount: number;
}

export interface StatisticsBody {
    specialty?: string;
}