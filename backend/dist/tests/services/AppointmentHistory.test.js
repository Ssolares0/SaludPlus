"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tests/services/doctor.service.test.ts
const Postgres_1 = require("../../src/config/database/Postgres");
const employee_service_1 = require("../../src/services/employee.service");
const typeorm_1 = require("typeorm");
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
    let doctorService;
    const mockAppointmentRepository = {
        find: jest.fn(),
    };
    beforeEach(() => {
        doctorService = new employee_service_1.EmployeService();
        Postgres_1.AppDataSource.getRepository.mockReturnValue(mockAppointmentRepository);
        jest.clearAllMocks();
    });
    // -----------------------------------------------------------
    // Caso 3: Con filtro de fechas
    // -----------------------------------------------------------
    it('debe filtrar por rango de fechas', async () => {
        const startDate = new Date('2024-03-01');
        const endDate = new Date('2024-03-31');
        await doctorService.getDoctorAppointmentHistory(1, '', startDate, endDate);
        // Verificar que Between se llamó con las fechas correctas
        expect(typeorm_1.Between).toHaveBeenCalledWith(startDate, endDate);
        expect(mockAppointmentRepository.find).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                doctor: { id: 1 },
                status: (0, typeorm_1.Not)('scheduled'),
                appointment_date: { start: startDate, end: endDate },
            },
        }));
    });
});
