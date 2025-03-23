import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './Person.entity';
import { EmployeeSpecialty } from './EmployeeSpecialties.entity';
import { EmployeeDepartmetn } from './EmployeeDepartment.entity';
import { Appointment } from './Appointments.entity';

@Entity({name:'employees'})
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true , nullable:false})
  employee_number!: string; // Número de colegiado

  @Column({ nullable: false, type:'date'})
  hire_date!: Date;

  @Column({type:'decimal', nullable:true})
  salary!: number;

  //Relacion Especialidaddes 1:N
  @OneToMany(() => EmployeeSpecialty, (employeeSpecialty) => employeeSpecialty.employee)
  specialty!: EmployeeSpecialty[];

  //Relacion Departamentos 1:N
  @OneToMany(() => EmployeeDepartmetn, (employeeDepartment) => employeeDepartment.employee)
  department!: EmployeeDepartmetn[];

  //Relacion con Citas 1:N
  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments!: Appointment[];

  @OneToOne(() => Person)
  @JoinColumn({name:'person_id'})
  @JoinColumn()
  person!: Person; // Relación 1:1 con Persona
}