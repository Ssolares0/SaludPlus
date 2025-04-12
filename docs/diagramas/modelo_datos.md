# 🗃️ Modelo de Datos

## Relacional o NoSQL

El sistema utiliza una **base de datos relacional PostgreSQL**, ideal para mantener la integridad de los datos, realizar consultas complejas y garantizar relaciones consistentes entre entidades como usuarios, pacientes y empleados.

## 🧱 Esquema de Tablas

### 📌 `roles`

Define los roles del sistema (e.g., administrador, médico, recepcionista).

| Campo      | Tipo        | Descripción            |
| ---------- | ----------- | ---------------------- |
| id         | SERIAL      | Clave primaria         |
| name       | VARCHAR(50) | Nombre del rol         |
| created_at | TIMESTAMP   | Fecha de creación      |
| updated_at | TIMESTAMP   | Fecha de actualización |

---

### 👤 `people`

Representa a una persona en general, ya sea paciente, empleado o contacto.

| Campo       | Tipo         | Descripción            |
| ----------- | ------------ | ---------------------- |
| id          | SERIAL       | Clave primaria         |
| first_name  | VARCHAR(100) | Nombre                 |
| last_name   | VARCHAR(100) | Apellido               |
| national_id | VARCHAR(50)  | Cédula o DNI           |
| email       | VARCHAR(100) | Correo electrónico     |
| birth_date  | DATE         | Fecha de nacimiento    |
| gender      | CHAR(1)      | Género                 |
| phone       | VARCHAR(20)  | Teléfono               |
| address     | VARCHAR(200) | Dirección              |
| created_at  | TIMESTAMP    | Fecha de creación      |
| updated_at  | TIMESTAMP    | Fecha de actualización |

---

### 🔐 `users`

Usuarios registrados del sistema, relacionados con una persona y un rol.

| Campo             | Tipo         | Descripción           |
| ----------------- | ------------ | --------------------- |
| id                | SERIAL       | Clave primaria        |
| name              | VARCHAR(100) | Nombre completo       |
| email             | VARCHAR(100) | Correo único          |
| password          | BYTEA        | Contraseña cifrada    |
| remember_token    | VARCHAR(100) | Token de sesión       |
| email_verified_at | TIMESTAMP    | Fecha de verificación |
| role_id           | INT          | FK a `roles`          |
| person_id         | INT          | FK a `people`         |

---

### 🧍‍♂️ `patients`

Pacientes registrados, asociados a una persona.

| Campo            | Tipo        | Descripción      |
| ---------------- | ----------- | ---------------- |
| id               | SERIAL      | Clave primaria   |
| person_id        | INT         | FK a `people`    |
| insurance_number | VARCHAR(50) | Número de seguro |

---

### 🩺 `employees`

Empleados como médicos o personal clínico.

| Campo           | Tipo        | Descripción               |
| --------------- | ----------- | ------------------------- |
| id              | SERIAL      | Clave primaria            |
| person_id       | INT         | FK a `people`             |
| employee_number | VARCHAR(50) | Código único del empleado |
| hire_date       | DATE        | Fecha de contratación     |
| salary          | DECIMAL     | Salario                   |

---

### 🧠 `specialties`

Especialidades médicas disponibles.

| Campo       | Tipo         | Descripción               |
| ----------- | ------------ | ------------------------- |
| id          | SERIAL       | Clave primaria            |
| name        | VARCHAR(100) | Nombre de la especialidad |
| description | VARCHAR(200) | Descripción               |

---

### 🏥 `departments`

Departamentos o clínicas del centro médico.

| Campo    | Tipo         | Descripción             |
| -------- | ------------ | ----------------------- |
| id       | SERIAL       | Clave primaria          |
| name     | VARCHAR(100) | Nombre del departamento |
| location | VARCHAR(200) | Ubicación               |

---

### 📞 `emergency_contacts`

Contactos de emergencia para una persona.

| Campo     | Tipo         | Descripción         |
| --------- | ------------ | ------------------- |
| id        | SERIAL       | Clave primaria      |
| person_id | INT          | FK a `people`       |
| name      | VARCHAR(100) | Nombre del contacto |
| phone     | VARCHAR(20)  | Teléfono            |

---

### 🔗 `employee_specialty`

Relación entre empleados y especialidades (muchos a muchos).

---

### 🏢 `employee_department`

Relación entre empleados y departamentos (muchos a muchos).

---

### 🧑‍🤝‍🧑 `patient_department`

Relación entre pacientes y departamentos.

---

### 📆 `appointments`

Citas médicas entre pacientes y empleados.

| Campo               | Tipo         | Descripción                         |
| ------------------- | ------------ | ----------------------------------- |
| id                  | SERIAL       | Clave primaria                      |
| patient_id          | INT          | FK a `patients`                     |
| employee_id         | INT          | FK a `employees`                    |
| appointment_date    | TIMESTAMP    | Fecha y hora de la cita             |
| reason              | VARCHAR(500) | Motivo de la cita                   |
| status              | VARCHAR(20)  | Estado (scheduled, cancelled, etc.) |
| treatment           | VARCHAR(500) | Tratamiento aplicado                |
| cancellation_reason | VARCHAR(500) | Motivo de cancelación               |

---

### ⏰ `doctor_schedules`

Horarios de atención por empleado.

| Campo       | Tipo     | Descripción              |
| ----------- | -------- | ------------------------ |
| id          | SERIAL   | Clave primaria           |
| employee_id | INT      | FK a `employees`         |
| day_of_week | SMALLINT | Día de la semana (1 a 7) |
| start_time  | TIME     | Hora de inicio           |
| end_time    | TIME     | Hora de fin              |

---

### 🧾 `action_events`

Historial de acciones para auditoría del sistema.

| Campo     | Tipo        | Descripción                    |
| --------- | ----------- | ------------------------------ |
| id        | BIGSERIAL   | Clave primaria                 |
| user_id   | INT         | FK a `users` (puede ser NULL)  |
| name      | VARCHAR     | Nombre de la acción            |
| fields    | TEXT        | Campos afectados               |
| status    | VARCHAR(25) | Estado (running, failed, etc.) |
| exception | TEXT        | Errores si existen             |
| original  | TEXT        | Valores originales             |
| changes   | TEXT        | Cambios realizados             |

---

## 🖼️ ER

![er](./img/erd.png)
Link del diagrama: [ERD](https://mermaid.live/edit#pako:eNrNWG1v4jgQ_iuRv3QrdSte28I3Dnx3aCGwEG7VFVJkkilYTZzIdnbLdvnv5yQEAiQhvV1dqdQWkmfG83hePONXZHk2oDYC3qNkyYk7Z5r6mYwGeKq9xl_CH8qkRm1t_Gn_6Bvh1orwD83KtcaIC_s3krogJHF9zeJAJNgmkdoc9fCfndnA0LqzyQTrhmn0h3hqdIbjOcqSDXz7VFafDQYJfBP_i_-O8Wg8wCVNrlaUzU-UC2keWn4AcEju-5izpB4jjqkWmaOZ3v88wwf2nSgEl1AnHxvS1RaUy5UZfZyjY0Ss6lpbArOBZwCS5WpqNX_lMSjEKBCxbQ5CZMDew4mzKZ5M3-LDAu8dbnbausVaAtF8IsR3j9s54hxccBfATek9Ayvcn2gl8xtw-kQTqsfokAj3HFDBcvjQBy48dvD4XdKnY_SV0nObn2NxOi0oEwEnzAKTBeEGXkho4eF4MHrE-DcwBNd3vDWkCCYJPTKyk3pFOexyOgsEFnWJoyLvWhPEIXx9Ibs2HeNuvzNQsfEb0jIqODYIi1M_LJ0XwrGHx52JMSwR_WU5Op5FLoggHuLJX1jvPprdkW50ur-a5YX0t-fOZSS7mcTvYwnGu7Q-LtHCV-lJHLl-9yq947WP2V8hZoNPuHSByUs5f95GzFdZdmz8hfHqjMejvl6quhQxynTh3ibi-56CRYwLjpn9IRY1OERklqh0Liv1MhApolfCWoEdOGBf5WqW4e6GthQoj4BW2CY4TlQrzVx73uVMGHWN0cScdv_GvdmgVNOQ6SKhTnUnCkmyNr0n8zvAs1pfqe1-0j6kH_6BjS8Y61pV6-g97f76mEXoCi7N6GO2d6NXajA4h_nfU6Br9Ee6if85zoEFXQrVNBMnazsD9SqerHLjs9mMj6FzGGJFg9pCdd9y7b8Ffn595ZQlyFJ6t9DzOl01kjulVMbITI0SXqQaccGxRaGWrBznAWOULa9O9MGLBf-xdcuHn42m3fIep0uqJu48uooSW8Ix34NgjC82fv78-NF73Y6bbYUngi4ZSSS2dwknKA6-GpZVYctB7oaoEOwHYKusBZ6N3c8jpcAnHVwoFZ4VkEjEZm4FDnMutp049Mfe8MTURCB9TkU7Et4x7OB7a3PxoTE25AqcVNQTAiciGV3ciVB6QCkWU3ERdgWg2SVWTLUhkXtACTKwQNvtSHpqOCNteezA5uO9z-h99jGhUiO86xFhaS9YO0fHkVfiGNnkxYhyOXDFEN0gF7hLqI3aKCrYatdXoBp-FMJswp9DjRuFI4H0pmtmobbkAdwg7gXLFWo_EUeob3Fqb28WE4hP2FfP230Fm0qPD-NryOg2MoKg9it6Qe168_a-VW_eVSoPD41K465-g9aoXa20btVvvVapN-r3rVaturlBPyKlldtWs9mqNerVWuOu1ni42_wLEIoblQ)

---

> 📌 Ver: [Diagrama de secuencias](../diagramas/secuencias.md) para detalles.
