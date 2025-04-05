import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmployeeSpecialty } from './EmployeeSpecialties.entity';
// import { Specialty } from './Specialty';

@Entity({name:'specialties'})
export class Specialty {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, type:'varchar', nullable:false})
  name!: string; 

  @Column({ unique: true, type:'varchar', nullable:true})
  description!: string; 

  @OneToMany(() => EmployeeSpecialty, (employeespeciality) => employeespeciality.specialty)
  employeeSpecialties!: EmployeeSpecialty[];

}