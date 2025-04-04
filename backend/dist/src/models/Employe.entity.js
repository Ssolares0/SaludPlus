"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const Person_entity_1 = require("./Person.entity");
const EmployeeSpecialties_entity_1 = require("./EmployeeSpecialties.entity");
const EmployeeDepartment_entity_1 = require("./EmployeeDepartment.entity");
const Appointments_entity_1 = require("./Appointments.entity");
const DoctorSchedule_entity_1 = require("./DoctorSchedule.entity");
let Employee = class Employee {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Employee.prototype, "employee_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'date' }),
    __metadata("design:type", Date)
], Employee.prototype, "hire_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', nullable: true }),
    __metadata("design:type", Number)
], Employee.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmployeeSpecialties_entity_1.EmployeeSpecialty, (employeeSpecialty) => employeeSpecialty.employee),
    __metadata("design:type", Array)
], Employee.prototype, "specialty", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmployeeDepartment_entity_1.EmployeeDepartmetn, (employeeDepartment) => employeeDepartment.employee),
    __metadata("design:type", Array)
], Employee.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointments_entity_1.Appointment, (appointment) => appointment.doctor),
    __metadata("design:type", Array)
], Employee.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DoctorSchedule_entity_1.DoctorSchedule, (schedule) => schedule.doctor),
    __metadata("design:type", Array)
], Employee.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Person_entity_1.Person),
    (0, typeorm_1.JoinColumn)({ name: 'person_id' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Person_entity_1.Person)
], Employee.prototype, "person", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)({ name: 'employees' })
], Employee);
