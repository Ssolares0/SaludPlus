## 📘 MANUAL TÉCNICO – _SaludPlus_

### 1. 🧾 Descripción General del Sistema

**SaludPlus** es una plataforma web para la gestión de citas médicas, pacientes y personal clínico, diseñada para clínicas o centros de salud. La aplicación está desarrollada utilizando tecnologías modernas como Angular (frontend), TypeScript/Node.js (backend), PostgreSQL (base de datos) y Docker para el despliegue contenerizado.

---

### 2. 🏗️ Arquitectura General

- **Cliente Web:** Angular
- **API Backend:** TypeScript (Node.js/Express)
- **Base de Datos:** PostgreSQL
- **Correo Electrónico:** SMTP externo
- **Contenerización:** Docker + docker-compose

> 📌 Ver: [Diagrama de Despliegue](../diagramas/despliegue.md) para detalles gráficos.

---

### 3. 🛠️ Requisitos Técnicos

| Componente     | Versión Recomendada |
| -------------- | ------------------- |
| Node.js        | ≥ 18.x              |
| Angular CLI    | ≥ 16.x              |
| PostgreSQL     | ≥ 13.x              |
| Docker         | ≥ 20.x              |
| Docker Compose | ≥ 1.29              |

---

### 4. ⚙️ Instalación y Configuración

#### 📂 Clonar el repositorio

```bash
git clone falta el link brrr
cd saludplus
```

#### 🐳 Usar Docker

```bash
docker-compose up --build
```

> Esto levanta los servicios: frontend, backend y base de datos.

#### 🔐 Variables de entorno

Crear archivo `.env` en el backend con:

```env
DB_HOST=db
DB_PORT=5432
DB_NAME=saludplus
DB_USER=postgres
DB_PASS=tu_clave
SMTP_HOST=smtp.mail.com
SMTP_USER=notificaciones@mail.com
SMTP_PASS=clave_secreta
```

---

### 5. 🧾 Modelo de Datos

- Base de datos relacional: **PostgreSQL**
- 15 tablas con relaciones entre personas, usuarios, pacientes, médicos, especialidades y departamentos.

> 📌 Ver: [database](../diagramas/modelo_datos.md) para detalles.

---

### 6. 🔐 Seguridad

- Autenticación con JWT
- Hash de contraseñas con bcrypt
- Validación de entradas con middleware
- Roles y permisos: definidos por tabla `roles`

---

### 7. 📡 API REST

| Método | Endpoint            | Descripción                |
| ------ | ------------------- | -------------------------- |
| GET    | `/api/users`        | Obtener todos los usuarios |
| POST   | `/api/appointments` | Crear una cita             |
| PUT    | `/api/users/:id`    | Actualizar un usuario      |
| DELETE | `/api/patients/:id` | Eliminar paciente          |

> 📌 Se recomienda usar Postman para probar la API (colección incluida si la tienes).

---

### 8. 🖥️ Estructura del Proyecto

```
saludplus/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── config/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── environments/
├── db/
│   └── database.sql
├── docker-compose.yml
└── README.md
```

---

### 9. 📦 Despliegue

#### Producción en servidor

1. Configura variables de entorno.
2. Usa `docker-compose up -d`.
3. Configura dominio + SSL (ej: con Nginx + certbot).

---

### 10. 📈 Monitoreo y Logs

- Se recomienda configurar `PM2` o `Docker Logs`.
- Guardar eventos en la tabla `action_events`.

---

### 11. 📈 Diagramas

> 📌 Ver: [Diagramas](../diagramas/casos_uso.md) para detalles.

> 📌 Ver: [README Principal](../../README.md) para detalles.
