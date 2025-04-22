// src/entities/Medication.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Treatment } from './Treatments.entity';

@Entity({name:'medications'})
export class Medication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 50 })
  quantity!: string;

  @Column({ length: 50 })
  duration!: string;

  @Column({ type: 'text' })
  dosage_description!: string;

  // Relación N:1 con Tratamiento (Muchos medicamentos pertenecen a un tratamiento)
  @ManyToOne(() => Treatment, (treatment) => treatment.medications)
  @JoinColumn({ name: 'treatment_id' })
  treatment!: Treatment;
}