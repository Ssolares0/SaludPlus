export const demoConfig = {
  // Detectar si estamos en modo demo (GitHub Pages)
  isDemoMode: window.location.hostname.includes('github.io') || 
              window.location.hostname === 'localhost' ||
              window.location.search.includes('demo=true'),
  
  // Usuarios de prueba para la demo
  demoUsers: [
    {
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      token: 'demo-admin-token-12345',
      name: 'Administrador Demo',
      isAdmin: true,
      requiresAuth2: false // Para simplificar la demo
    },
    {
      email: 'prueba@gmail.com', 
      password: 'prueba123',
      role: 'doctor',
      token: 'demo-doctor-token-12345',
      name: 'Dr. Juan Pérez',
      doctorId: 1,
      userId: 1
    },
    {
      email: 'paciente@gmail.com',
      password: 'paciente123', 
      role: 'paciente',
      token: 'demo-patient-token-12345',
      name: 'María García',
      patientId: 1,
      userId: 2
    }
  ],

  // Datos mock para la demo
  mockData: {
    patients: [
      { id: 1, firstName: 'María', lastName: 'García', email: 'maria@example.com', dpi: '1234567890123', phone: '12345678' },
      { id: 2, firstName: 'Carlos', lastName: 'López', email: 'carlos@example.com', dpi: '1234567890124', phone: '87654321' },
      { id: 3, firstName: 'Ana', lastName: 'Martínez', email: 'ana@example.com', dpi: '1234567890125', phone: '11223344' }
    ],
    doctors: [
      { id: 1, firstName: 'Dr. Juan', lastName: 'Pérez', email: 'juan@example.com', specialty: 'Cardiología', department: 'Medicina Interna' },
      { id: 2, firstName: 'Dra. Sofia', lastName: 'Rodríguez', email: 'sofia@example.com', specialty: 'Pediatría', department: 'Pediatría' }
    ],
    appointments: [
      { id: 1, patientName: 'María García', doctorName: 'Dr. Juan Pérez', date: '2025-10-15', time: '09:00', status: 'Programada' },
      { id: 2, patientName: 'Carlos López', doctorName: 'Dra. Sofia Rodríguez', date: '2025-10-16', time: '10:30', status: 'Completada' }
    ]
  }
};