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
exports.Person = void 0;
// models/Person.ts
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const EmergencieContac_entity_1 = require("./EmergencieContac.entity");
const Patient_entity_1 = require("./Patient.entity");
const Employe_entity_1 = require("./Employe.entity");
let Person = class Person {
};
exports.Person = Person;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Person.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Person.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Person.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", Object)
], Person.prototype, "national_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], Person.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Object)
], Person.prototype, "birth_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 1 }),
    __metadata("design:type", Object)
], Person.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", Object)
], Person.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Person.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", Object)
], Person.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => User_entity_1.User, (user) => user.person),
    __metadata("design:type", User_entity_1.User)
], Person.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Patient_entity_1.Patient, (patient) => patient.person),
    __metadata("design:type", Patient_entity_1.Patient)
], Person.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Employe_entity_1.Employee, (employe) => employe.person),
    __metadata("design:type", Employe_entity_1.Employee)
], Person.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => EmergencieContac_entity_1.EmergencyContact, (contact) => contact.person),
    __metadata("design:type", Array)
], Person.prototype, "emergencyContacts", void 0);
exports.Person = Person = __decorate([
    (0, typeorm_1.Entity)({ name: "people" })
], Person);
