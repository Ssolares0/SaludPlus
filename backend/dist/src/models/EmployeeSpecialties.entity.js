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
exports.EmployeeSpecialty = void 0;
const typeorm_1 = require("typeorm");
const Employe_entity_1 = require("./Employe.entity");
const Specialty_entity_1 = require("./Specialty.entity");
let EmployeeSpecialty = class EmployeeSpecialty {
};
exports.EmployeeSpecialty = EmployeeSpecialty;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmployeeSpecialty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employe_entity_1.Employee, (employee) => employee.specialty),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", Employe_entity_1.Employee)
], EmployeeSpecialty.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Specialty_entity_1.Specialty, (specialty) => specialty.employeeSpecialties),
    (0, typeorm_1.JoinColumn)({ name: 'specialty_id' }),
    __metadata("design:type", Specialty_entity_1.Specialty)
], EmployeeSpecialty.prototype, "specialty", void 0);
exports.EmployeeSpecialty = EmployeeSpecialty = __decorate([
    (0, typeorm_1.Entity)({ name: 'employee_specialty' })
], EmployeeSpecialty);
