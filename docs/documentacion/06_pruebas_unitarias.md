# 🧪 Pruebas Unitarias

## Funcionalidades probadas

### Prueba 1: Registro de Pacientes
![Registro de Pacientes](<img/preubas Unitarias/prueba1.jpg>)
- **Descripción:** Esta prueba verifica que el formulario de registro de pacientes funcione correctamente, validando campos obligatorios como nombre, correo electrónico y contraseña.
- **Criterios de éxito:**
  - Todos los campos obligatorios deben completarse.
  - La contraseña debe cumplir con los requisitos de seguridad.
  - El sistema debe mostrar un mensaje de confirmación tras un registro exitoso.

---

### Prueba 2: Inicio de Sesión
![Inicio de Sesión](<img/preubas Unitarias/prueba2.jpg>)
- **Descripción:** Esta prueba valida el proceso de inicio de sesión para usuarios registrados (pacientes y médicos).
- **Criterios de éxito:**
  - El sistema debe rechazar credenciales incorrectas con un mensaje de error.
  - Los usuarios aprobados deben ser redirigidos a su panel correspondiente.
  - Los usuarios no aprobados deben recibir un mensaje indicando el estado de su cuenta.

---

### Prueba 3: Programación de Citas
![Programación de Citas](<img/preubas Unitarias/prueba3.jpg>)
- **Descripción:** Esta prueba asegura que los pacientes puedan programar citas con médicos disponibles.
- **Criterios de éxito:**
  - Solo se deben mostrar horarios disponibles.
  - El sistema debe validar que no existan conflictos de horario.
  - Tras programar una cita, debe mostrarse un mensaje de confirmación.

---

> 📌 Ver: [Evaluaciones](../evaluaciones/scrum_master.md) para detalles.