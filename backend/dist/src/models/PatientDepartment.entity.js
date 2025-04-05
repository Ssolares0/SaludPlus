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
exports.PatientDepartment = void 0;
const typeorm_1 = require("typeorm");
const Employe_entity_1 = require("./Employe.entity");
const Department_1 = require("./Department");
let PatientDepartment = class PatientDepartment {
};
exports.PatientDepartment = PatientDepartment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PatientDepartment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employe_entity_1.Employee, (employee) => employee.department),
    (0, typeorm_1.JoinColumn)({ name: 'patient_id' }),
    __metadata("design:type", Employe_entity_1.Employee)
], PatientDepartment.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Department_1.Department, (department) => department.employeeDepartments),
    (0, typeorm_1.JoinColumn)({ name: 'department_id' }),
    __metadata("design:type", Department_1.Department)
], PatientDepartment.prototype, "department", void 0);
exports.PatientDepartment = PatientDepartment = __decorate([
    (0, typeorm_1.Entity)({ name: 'patient_department' })
], PatientDepartment);
