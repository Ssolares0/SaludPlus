// tests/services/doctor.service.test.ts
import { AppDataSource } from '../../src/config/database/Postgres';
import { EmployeService } from '../../src/services/employee.service';
import { Appointment } from '../../src/models/Appointments.entity';
import { Between, Not } from 'typeorm';

// Mock de TypeORM
jest.mock('../../src/config/database/Postgres', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

// Mock de Between y Not (TypeORM)
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  Between: jest.fn((start, end) => ({ start, end })),
  Not: jest.fn((value) => ({ value })),
}));

describe('DoctorService - getDoctorAppointmentHistory', () => {
  let doctorService: EmployeService;
  const mockAppointmentRepository = {
    find: jest.fn(),
  };

  beforeEach(() => {
    doctorService = new EmployeService();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockAppointmentRepository);
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------
  // Caso 3: Con filtro de fechas
  // -----------------------------------------------------------
  it('debe filtrar por rango de fechas', async () => {
    const startDate = new Date('2024-03-01');
    const endDate = new Date('2024-03-31');

    await doctorService.getDoctorAppointmentHistory(
      1,
      '',
      startDate,
      endDate,
    );

    // Verificar que Between se llamó con las fechas correctas
    expect(Between).toHaveBeenCalledWith(startDate, endDate);
    expect(mockAppointmentRepository.find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          doctor: { id: 1 },
          status: Not('scheduled'),
          appointment_date: { start: startDate, end: endDate },
        },
      }),
    );
  });

});