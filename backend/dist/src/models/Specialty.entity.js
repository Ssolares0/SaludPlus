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
exports.Specialty = void 0;
const typeorm_1 = require("typeorm");
const EmployeeSpecialties_entity_1 = require("./EmployeeSpecialties.entity");
// import { Specialty } from './Specialty';
let Specialty = class Specialty {
};
exports.Specialty = Specialty;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Specialty.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Specialty.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Specialty.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmployeeSpecialties_entity_1.EmployeeSpecialty, (employeespeciality) => employeespeciality.specialty),
    __metadata("design:type", Array)
], Specialty.prototype, "employeeSpecialties", void 0);
exports.Specialty = Specialty = __decorate([
    (0, typeorm_1.Entity)({ name: 'specialties' })
], Specialty);
