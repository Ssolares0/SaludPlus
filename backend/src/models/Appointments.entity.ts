import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './Patient.entity';
import { Employee } from './Employe.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  appointment_date!: Date; 

  @Column({ type: 'varchar', length: 500 })
  reason!: string; 

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status!: 'scheduled' | 'canceled' | 'completed'; 

  @Column({ type: 'varchar', length: 500, nullable: true })
  treatment?: string; //(si la cita se completó)

  @Column({ type: 'varchar', length: 500, nullable: true })
  cancellationReason?: string;

  // Relación N:1 con Pacient
  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  // Relación N:1 con employe
  @ManyToOne(() => Employee, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Employee;
}