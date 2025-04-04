# ✅ Requerimientos

## Funcionales

**Pacientes**

- Página principal
  - Dashboard personalizado
  - Perfil del paciente
- Gestión de Citas
  - Programar nueva cita
  - Ver citas activas
  - Cancelar citas
  - Consultar historial de citas

**Médico**

- Gestión de Citas
  - Panel de control de citas
  - Atención de pacientes (estados: pendiente, en proceso, finalizada)
  - Cancelación de citas
- Configuración
  - Gestión de horarios disponibles
  - Consulta de historial de atenciones

**Administrador**

- Gestión de Usuarios
  - Validación y aprobación de registros médicos
  - Administración de pacientes
  - Administración de personal médico
- Reportería
  - Generación de reportes estadísticos
  - Análisis de rendimiento

## No Funcionales

- **Seguridad**

  - Autenticación de dos factores
  - Encriptación de datos sensibles
  - Cumplimiento con regulaciones de datos médicos

- **Rendimiento**

  - Tiempo de respuesta rápido
  - Capacidad para manejar usuarios concurrentes

- **Disponibilidad**

  - Sistema disponible al 99%

- **Usabilidad**
  - Interfaz intuitiva y responsive (quizás segunda fase la responsividad)
  - Compatibilidad con principales navegadores

# Product Backlog

| **Historia** | **Tamaño** | **Prioridad** | **Sprint** |
| ------------ | ---------- | ------------- | ---------- |
| HU-001       | M          | Alta          | 1          |
| HU-002       | M          | Alta          | 1          |
| HU-003       | M          | Alta          | 1          |
| HU-004       | M          | Alta          | 1          |
| HU-005       | S          | Alta          | 2          |
| HU-008       | L          | Alta          | 2          |
| HU-013       | S          | Alta          | 2          |
| HU-014       | M          | Alta          | 2          |
| HU-017       | M          | Alta          | 2          |
| HU-021       | M          | Alta          | 2          |
| HU-022       | M          | Alta          | 2          |
| HU-006       | S          | Media         | 2          |
| HU-007       | L          | Media         | 2          |
| HU-009       | S          | Media         | 2          |
| HU-010       | S          | Media         | 2          |
| HU-015       | S          | Media         | 2          |
| HU-018       | M          | Media         | 2          |
| HU-023       | S          | Media         | 2          |
| HU-024       | S          | Media         | 2          |
| HU-011       | S          | Baja          | 2          |
| HU-012       | S          | Baja          | 2          |
| HU-016       | M          | Baja          | 2          |
| HU-019       | S          | Baja          | 2          |
| HU-020       | S          | Baja          | 2          |
| HU-025       | L          | Baja          | 2          |

# Historias de usuario

## Módulo de Registro y Autenticación

## HU-001: Registro de paciente

### Registro de paciente en la plataforma

### Descripción/Narrativa

Como paciente, quiero registrarme en la plataforma proporcionando mis datos personales para poder acceder a los servicios médicos.

### Criterios de Aceptación

- El formulario debe incluir: nombre, apellido, DPI, género, dirección, teléfono, fecha de nacimiento, fotografía (opcional), correo electrónico y contraseña.
- La contraseña debe tener mínimo 8 caracteres e incluir al menos una letra minúscula, una mayúscula y un número.
- El sistema debe encriptar la contraseña antes de almacenarla.
- El sistema debe validar que el correo electrónico no esté registrado previamente.
- Debe mostrar un mensaje de confirmación indicando que la solicitud está pendiente de aprobación.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## HU-002: Registro de médico

### Registro de médico en la plataforma

### Descripción/Narrativa

Como médico, quiero registrarme en la plataforma proporcionando mis datos profesionales para poder ofrecer mis servicios a los pacientes.

### Criterios de Aceptación

- El formulario debe incluir: nombre, apellido, DPI, fecha de nacimiento, género, dirección, teléfono, fotografía (obligatoria), número de colegiado, especialidad, dirección de la clínica, correo electrónico y contraseña.
- La contraseña debe tener mínimo 8 caracteres e incluir al menos una letra minúscula, una mayúscula y un número.
- El sistema debe encriptar la contraseña antes de almacenarla.
- El sistema debe validar que el correo electrónico y número de colegiado no estén registrados previamente.
- Debe mostrar un mensaje de confirmación indicando que la solicitud está pendiente de aprobación.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## HU-003: Autenticación de paciente y médico

### Inicio de sesión para pacientes y médicos

### Descripción/Narrativa

Como usuario (paciente o médico), quiero iniciar sesión en el sistema para acceder a mis funcionalidades correspondientes.

### Criterios de Aceptación

- El sistema debe verificar si el usuario ha sido aprobado por un administrador antes de permitir el acceso.
- Si el usuario no ha sido aprobado, debe mostrarse un mensaje indicándolo.
- Si las credenciales son incorrectas, debe mostrarse un mensaje de error específico.
- Si la autenticación es exitosa, debe redirigirse al usuario a su página principal según su rol.
- Debe incluir un enlace para registrarse si el usuario aún no tiene cuenta.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Alta

## HU-004: Autenticación de administrador

### Inicio de sesión para administrador con verificación de dos factores

### Descripción/Narrativa

Como administrador, quiero un sistema de autenticación en dos pasos para acceder de forma segura a las funciones administrativas del sistema.

### Criterios de Aceptación

- El primer paso debe ser un inicio de sesión con usuario y contraseña predeterminados.
- El segundo paso debe requerir subir un archivo llamado auth2.ayd1 con una contraseña encriptada.
- El sistema debe validar la contraseña encriptada en el archivo.
- Las contraseñas del primer y segundo paso deben ser diferentes.
- Tras la validación exitosa, debe redirigirse a la página principal del administrador.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## Módulo Paciente

## HU-005: **Visualización de médicos disponibles**

### Listado de médicos disponibles

### Descripción/Narrativa

Como paciente, quiero ver la lista de médicos registrados para poder elegir uno según mis necesidades médicas.

### Criterios de Aceptación

- Debe mostrar nombre completo, especialidad, dirección de la clínica y foto de cada médico.
- No debe mostrar médicos con los que el paciente ya tiene una cita programada.
- La lista debe actualizarse automáticamente cuando se agreguen nuevos médicos aprobados.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Alta

## HU-006: **Búsqueda de médicos por especialidad**

### Filtrado de médicos por especialidad

### Descripción/Narrativa

Como paciente, quiero buscar médicos según su especialidad para encontrar el profesional adecuado a mis necesidades médicas.

### Criterios de Aceptación

- Debe permitir escribir la especialidad y realizar la búsqueda con un botón.
- Alternativamente, puede implementarse un ComboBox con las especialidades disponibles.
- Los resultados deben mostrar la misma información que en la página principal (nombre, especialidad, dirección, foto).
- Si no hay médicos con la especialidad buscada, debe mostrarse un mensaje indicándolo.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Media

## HU-007: **Visualización de horarios del médico**

### Consulta de disponibilidad horaria de médicos

### Descripción/Narrativa

Como paciente, quiero ver los horarios disponibles de un médico para poder programar una cita en un momento conveniente.

### Criterios de Aceptación

- Debe mostrar los días que atiende el médico.
- Debe mostrar el horario de atención para esos días.
- Debe permitir filtrar por fecha para ver disponibilidad específica.
- Debe diferenciar visualmente entre horarios ocupados y disponibles.
- Si el médico no atiende en una fecha seleccionada, debe mostrarse un mensaje indicándolo.

### Tamaño/Estimación

- L (Large)

### Prioridad

- Media

## HU-008: **Programación de citas**

### Agendar cita médica

### Descripción/Narrativa

Como paciente, quiero programar una cita con un médico seleccionando fecha, hora y especificando el motivo para recibir atención médica.

### Criterios de Aceptación

- Debe permitir seleccionar fecha y hora de la cita.
- Debe incluir un campo para describir el motivo de la cita.
- Debe validar que la fecha seleccionada esté dentro de los días que atiende el médico.
- Debe validar que el horario seleccionado esté disponible.
- No debe permitir agendar más de una cita con el mismo médico.
- Si una validación falla, debe mostrar el motivo específico por el que no se puede generar la cita.

### Tamaño/Estimación

- L (Large)

### Prioridad

- Alta

## HU-009: **Visualización de citas activas**

### Listado de citas pendientes

### Descripción/Narrativa

Como paciente, quiero ver la lista de mis citas programadas pendientes para tener un control de mis próximas consultas médicas.

### Criterios de Aceptación

- Debe mostrar fecha, hora, nombre del médico, dirección de la clínica y motivo de cada cita.
- Debe ordenar las citas por fecha más próxima.
- Solo debe mostrar citas que aún no han sido atendidas o canceladas.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Media

## HU-010: **Cancelación de citas**

### Cancelar cita programada

### Descripción/Narrativa

Como paciente, quiero cancelar una cita programada cuando sea necesario para liberar ese espacio en la agenda del médico.

### Criterios de Aceptación

- Debe ser accesible desde la vista de citas activas.
- Debe solicitar confirmación antes de proceder con la cancelación.
- Tras la cancelación, la cita debe desaparecer de la lista de citas activas.
- El horario cancelado debe quedar disponible para otros pacientes.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Media

## HU-011: **Historial de citas**

### Visualización del historial médico

### Descripción/Narrativa

Como paciente, quiero ver mi historial de citas atendidas y canceladas para llevar un registro de mi atención médica.

### Criterios de Aceptación

- Debe mostrar fecha de la cita, nombre del médico, dirección de la clínica, motivo y estado (Atendido/Cancelado).
- Para citas atendidas, debe mostrar el tratamiento indicado por el médico.
- Debe indicar quién canceló la cita (paciente o médico) cuando aplique.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Baja

## HU-012: **Gestión de perfil de paciente**

### Ver y actualizar perfil de paciente

### Descripción/Narrativa

Como paciente, quiero ver y actualizar mi información personal cuando sea necesario para mantener mis datos actualizados.

### Criterios de Aceptación

- Debe mostrar todos los datos del paciente ingresados durante el registro.
- Debe permitir modificar cualquier campo excepto el correo electrónico.
- Debe validar el formato de los datos actualizados.
- Debe mostrar un mensaje de confirmación cuando los cambios se guarden exitosamente.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Baja

## Módulo Médico

## HU-013: **Gestión de citas pendientes**

### Visualización de citas pendientes

### Descripción/Narrativa

Como médico, quiero ver todas mis citas pendientes ordenadas por fecha para organizar mi agenda de trabajo.

### Criterios de Aceptación

- Debe mostrar fecha, hora, nombre completo del paciente y motivo de cada cita.
- Las citas deben estar ordenadas por fecha más reciente.
- Solo debe mostrar citas que aún no han sido atendidas o canceladas.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Alta

## HU-014: **Atención de pacientes**

### Registrar atención y tratamiento

### Descripción/Narrativa

Como médico, quiero marcar una cita como atendida y registrar el tratamiento indicado para dejar constancia de la atención brindada.

### Criterios de Aceptación

- Debe incluir un botón para iniciar el proceso de atención.
- Debe mostrar un formulario para ingresar el tratamiento recomendado.
- Tras completar la atención, la cita debe marcarse como "Atendida".
- La cita debe desaparecer de la lista de citas pendientes.
- El tratamiento debe quedar registrado en el historial del paciente.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## HU-015: **Cancelación de citas como médico**

### Cancelar cita de paciente

### Descripción/Narrativa

Como médico, quiero cancelar citas programadas en caso de imprevistos para notificar a los pacientes que no podré atenderlos.

### Criterios de Aceptación

- Debe permitir cancelar cualquier cita pendiente.
- La cita cancelada debe desaparecer de la lista de citas pendientes.
- El sistema debe marcar la cita como "Cancelada por el médico".
- El horario liberado debe quedar disponible para nuevas citas.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Media

## HU-016: **Notificación de cancelación por correo**

### Envío de notificación al paciente

### Descripción/Narrativa

Como médico, quiero que se envíe automáticamente un correo al paciente cuando cancelo una cita para informarle sobre la cancelación.

### Criterios de Aceptación

- El correo debe incluir: fecha y hora de la cita cancelada, motivo original de la cita, nombre del médico y un mensaje de disculpa.
- El correo debe enviarse automáticamente tras la cancelación.
- Debe confirmarse que el correo se ha enviado correctamente.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Baja

## HU-017: **Configuración de horarios de atención**

### Establecer horarios de atención

### Descripción/Narrativa

Como médico, quiero configurar mis días y horarios de atención para que los pacientes puedan agendar citas en esos intervalos.

### Criterios de Aceptación

- Debe permitir seleccionar los días de la semana en que se atenderá.
- Debe permitir establecer un horario de inicio y fin que aplicará a todos los días seleccionados.
- Los horarios deben guardarse correctamente y reflejarse en el sistema.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## HU-018: **Actualización de horarios de atención**

### Modificar horarios de atención

### Descripción/Narrativa

Como médico, quiero actualizar mis días y horarios de atención cuando sea necesario para adaptarlos a mis necesidades profesionales.

### Criterios de Aceptación

- Debe mostrar la configuración actual de días y horarios.
- Debe permitir modificar los días de atención.
- Debe permitir modificar el horario de inicio y fin.
- Los cambios no deben afectar citas ya programadas.
- Debe mostrar una advertencia si hay citas programadas fuera del nuevo horario.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Media

## HU-019: **Historial de citas del médico**

### Visualización del historial de atenciones

### Descripción/Narrativa

Como médico, quiero ver un historial de todas las citas que he atendido o cancelado para llevar un control de mi actividad profesional.

### Criterios de Aceptación

- Debe mostrar fecha, hora, nombre del paciente y estado de la cita (Atendido, Cancelado por el médico, Cancelado por el paciente).
- Debe permitir filtrar el historial por fechas o estados.
- Debe permitir buscar por nombre de paciente.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Baja

## HU-020: **Gestión de perfil de médico**

### Ver y actualizar perfil profesional

### Descripción/Narrativa

Como médico, quiero ver y actualizar mi información profesional cuando sea necesario para mantener mis datos actualizados.

### Criterios de Aceptación

- Debe mostrar todos los datos del médico ingresados durante el registro.
- Debe permitir modificar cualquier campo excepto el correo electrónico.
- Debe validar el formato de los datos actualizados.
- Debe mostrar un mensaje de confirmación cuando los cambios se guarden exitosamente.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Baja

## Módulo Administrador

## HU-021: **Aprobación de pacientes**

### Gestión de solicitudes de pacientes

### Descripción/Narrativa

Como administrador, quiero revisar y aprobar/rechazar las solicitudes de registro de pacientes para controlar quién accede al sistema.

### Criterios de Aceptación

- Debe mostrar lista de pacientes pendientes de aprobación con su fotografía (o una por defecto), nombre completo, DPI, género, fecha de nacimiento y correo.
- Debe incluir botones para aprobar o rechazar cada solicitud.
- Al aprobar, el estado del paciente debe actualizarse para permitirle iniciar sesión.
- Al rechazar, la solicitud debe eliminarse o marcarse como rechazada.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## HU-022: **Aprobación de médicos**

### Gestión de solicitudes de médicos

### Descripción/Narrativa

Como administrador, quiero revisar y aprobar/rechazar las solicitudes de registro de médicos para garantizar que solo profesionales verificados ofrezcan servicios.

### Criterios de Aceptación

- Debe mostrar lista de médicos pendientes de aprobación con su fotografía, nombre completo, DPI, género, especialidad, número de colegiado y correo.
- Debe incluir botones para aprobar o rechazar cada solicitud.
- Al aprobar, el estado del médico debe actualizarse para permitirle iniciar sesión.
- Al rechazar, la solicitud debe eliminarse o marcarse como rechazada.

### Tamaño/Estimación

- M (Medium)

### Prioridad

- Alta

## HU-023: **Administración de pacientes**

### Visualización y gestión de pacientes activos

### Descripción/Narrativa

Como administrador, quiero ver la lista de todos los pacientes aprobados y poder darlos de baja cuando sea necesario.

### Criterios de Aceptación

- Debe mostrar la lista completa de pacientes aprobados con su información básica.
- Debe incluir una opción para dar de baja a cualquier paciente.
- Al dar de baja, debe solicitarse confirmación.
- Los pacientes dados de baja no deben poder iniciar sesión.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Media

## HU-024: **Administración de médicos**

### Visualización y gestión de médicos activos

### Descripción/Narrativa

Como administrador, quiero ver la lista de todos los médicos aprobados y poder darlos de baja cuando sea necesario.

### Criterios de Aceptación

- Debe mostrar la lista completa de médicos aprobados con su información profesional.
- Debe incluir una opción para dar de baja a cualquier médico.
- Al dar de baja, debe solicitarse confirmación.
- Los médicos dados de baja no deben poder iniciar sesión.
- Las citas programadas con un médico dado de baja deben marcarse como canceladas.

### Tamaño/Estimación

- S (Small)

### Prioridad

- Media

## HU-025: **Generación de reportes**

### Reportes estadísticos del sistema

### Descripción/Narrativa

Como administrador, quiero generar reportes sobre la actividad en la plataforma para analizar el uso del sistema y tomar decisiones basadas en datos.

### Criterios de Aceptación

- Debe generar al menos dos tipos de reportes.
- Debe incluir un reporte de médicos que más pacientes han atendido.
- Debe incluir un reporte de especialidades con mayor demanda.
- Los reportes deben poder visualizarse en la plataforma y/o descargarse.
- Debe permitir filtrar los reportes por rango de fechas.

### Tamaño/Estimación

- L (Large)

### Prioridad

- Baja
