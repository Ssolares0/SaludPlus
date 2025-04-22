// src/entities/Treatment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Appointment } from './Appointments.entity';
import { Medication } from './Medications.entity';

@Entity({name:'treatments'})
export class Treatment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  diagnosis!: string;

  //Una cita tiene un tratamiento
  @OneToOne(() => Appointment, (appointment) => appointment.treatment)
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  //Un tratamiento tiene múltiples medicamentos
  @OneToMany(() => Medication, (medication) => medication.treatment)
  medications!: Medication[];

}