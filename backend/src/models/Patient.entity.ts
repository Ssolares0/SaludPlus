import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Person } from './Person.entity';

@Entity({name:'patients'})
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type:'varchar', unique: true })
  insurance_number!: string;

  // Relación Uno a Uno (1 Usuario ↔ 1 Persona)
  @OneToOne(() => Person)
  @JoinColumn({ name: 'person_id' }) // Columna person_id en users
  person!: Person; // TypeORM manejará el ID automáticamente

  //Relacion con Citas

  //Relacion con departamento paciente
}