import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employe.entity';
import { Specialty } from './Specialty.entity';

@Entity({name:'employee_specialty'})
export class EmployeeSpecialty {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación con Empleado (Médico)
  @ManyToOne(() => Employee, (employee) => employee.specialty)
  @JoinColumn({name:'employee_id'})
  employee!: Employee;

  // Relación con Especialidad
  @ManyToOne(() => Specialty, (specialty) => specialty.employeeSpecialties)
  @JoinColumn({name:'specialty_id'})
  specialty!: Specialty;
}