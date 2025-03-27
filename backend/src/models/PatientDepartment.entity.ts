import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employe.entity';
import { Department } from './Department';

@Entity({name:'patient_department'})
export class PatientDepartment {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación con Empleado (Médico)
  @ManyToOne(() => Employee, (employee) => employee.department)
  @JoinColumn({name:'patient_id'})
  patient!: Employee;

  // Relación con Department
  @ManyToOne(() => Department, (department) => department.employeeDepartments)
  @JoinColumn({name:'department_id'})
  department!: Department;
}