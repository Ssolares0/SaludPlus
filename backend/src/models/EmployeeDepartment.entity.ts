import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employe.entity';
import { Department } from './Department';

@Entity({name:'employee_department'})
export class EmployeeDepartmetn {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación con Empleado (Médico)
  @ManyToOne(() => Employee, (employee) => employee.department)
  @JoinColumn({name:'employee_id'})
  employee!: Employee;

  // Relación con Department
  @ManyToOne(() => Department, (department) => department.employeeDepartments)
  @JoinColumn({name:'department_id'})
  department!: Department;
}