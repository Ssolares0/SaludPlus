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
exports.Patient = void 0;
const typeorm_1 = require("typeorm");
const Person_entity_1 = require("./Person.entity");
const Appointments_entity_1 = require("./Appointments.entity");
const PatientDepartment_entity_1 = require("./PatientDepartment.entity");
let Patient = class Patient {
};
exports.Patient = Patient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Patient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Patient.prototype, "insurance_number", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Person_entity_1.Person),
    (0, typeorm_1.JoinColumn)({ name: 'person_id' }),
    __metadata("design:type", Person_entity_1.Person)
], Patient.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Appointments_entity_1.Appointment, (appointment) => appointment.patient),
    __metadata("design:type", Array)
], Patient.prototype, "appointments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PatientDepartment_entity_1.PatientDepartment, (patientDepartment) => patientDepartment.patient),
    __metadata("design:type", Array)
], Patient.prototype, "department", void 0);
exports.Patient = Patient = __decorate([
    (0, typeorm_1.Entity)({ name: 'patients' })
], Patient);
