import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmployeeDepartmetn } from './EmployeeDepartment.entity';
// import { Specialty } from './Specialty';

@Entity({name:'departments'})
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type:'varchar', nullable:false})
  name!: string; 

  @Column({ unique: true, type:'varchar', nullable:true})
  location!: string; 

  @OneToMany(() => EmployeeDepartmetn, (employeeDepartment) => employeeDepartment.department)
  employeeDepartments!: EmployeeDepartmetn[];

}