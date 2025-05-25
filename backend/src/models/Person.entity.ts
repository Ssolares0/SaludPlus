// models/Person.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { EmergencyContact } from './EmergencieContac.entity';
import { Patient } from './Patient.entity';
import { Employee } from './Employe.entity';

@Entity({name:"people"})
export class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  first_name!: string;

  @Column({ type: 'varchar', length: 100 })
  last_name!: string;

  @Column({ type: 'varchar', unique: true })
  national_id!: string | null;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({type: 'date'})
  birth_date!: Date | null;

  @Column({type: 'char', length:1 })
  gender!: string | null;

  @Column({type: 'varchar', length:20})
  phone!: string | null;

  @Column({type:'text', nullable:true})
  photo?: string | null;

  @Column({type:'varchar', length: 200})
  address!: string | null;

  @Column({type:'varchar', length: 200})
  file_path!: string | null;


  @OneToOne(() => User, (user) => user.person)
  user!: User;

  @OneToOne(() => Patient, (patient) => patient.person)
  patient!: Patient;

  @OneToOne(() => Employee, (employe) => employe.person)
  employee!: Employee;

  @OneToMany(() => EmergencyContact, (contact) => contact.person)
  emergencyContacts!: EmergencyContact[];
}
