-- Tabla de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- Tabla de Personas
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    national_id VARCHAR(50) UNIQUE NULL,
    email VARCHAR(100) UNIQUE NULL,
    birth_date DATE NULL,
    gender CHAR(1) NULL,
    phone VARCHAR(20) NULL,
    address VARCHAR(200) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password BYTEA NOT NULL,
    remember_token VARCHAR(100) NULL,
    email_verified_at TIMESTAMP NULL,
    role_id INT NOT NULL,
    person_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tabla de Pacientes
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    person_id INT NOT NULL,
    insurance_number VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

-- Tabla de Empleados (Médicos)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    person_id INT NOT NULL,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

-- Tabla de Especialidades
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(200) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- Tabla de Departamentos (Clínicas)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(200) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

-- Tabla de Contactos de Emergencia
CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    person_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

-- Relación Muchos a Muchos: Empleado - Especialidad
CREATE TABLE employee_specialty (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    specialty_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id) ON DELETE CASCADE
);

-- Relación Muchos a Muchos: Empleado - Departamento (Clínica)
CREATE TABLE employee_department (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    department_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Relación Paciente - Departamento (opcional)
CREATE TABLE patient_department (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    department_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Tabla de Citas
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    employee_id INT NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    reason VARCHAR(500) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    treatment VARCHAR(500) NULL,
    cancellation_reason VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Tabla de Horarios de Médicos
CREATE TABLE doctor_schedules (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Tabla de Historial de Acciones
CREATE TABLE action_events (
    id BIGSERIAL PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NULL,
    actionable_type VARCHAR(255) NULL,
    actionable_id VARCHAR(255) NULL,
    target_type VARCHAR(255) NULL,
    target_id VARCHAR(255) NULL,
    model_type VARCHAR(255) NULL,
    model_id VARCHAR(255) NULL,
    fields TEXT NULL,
    status VARCHAR(25) NULL DEFAULT 'running',
    exception TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    original TEXT NULL,
    changes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
