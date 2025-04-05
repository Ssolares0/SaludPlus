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
exports.DoctorSchedule = void 0;
const typeorm_1 = require("typeorm");
const Employe_entity_1 = require("./Employe.entity");
let DoctorSchedule = class DoctorSchedule {
};
exports.DoctorSchedule = DoctorSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DoctorSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'smallint' }),
    __metadata("design:type", Number)
], DoctorSchedule.prototype, "day_of_week", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DoctorSchedule.prototype, "start_time", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DoctorSchedule.prototype, "end_time", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Employe_entity_1.Employee, (doctor) => doctor.schedules),
    (0, typeorm_1.JoinColumn)({ name: 'employee_id' }),
    __metadata("design:type", Employe_entity_1.Employee)
], DoctorSchedule.prototype, "doctor", void 0);
exports.DoctorSchedule = DoctorSchedule = __decorate([
    (0, typeorm_1.Entity)({ name: 'doctor_schedules' })
], DoctorSchedule);
