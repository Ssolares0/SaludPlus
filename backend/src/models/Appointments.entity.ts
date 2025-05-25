import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Patient } from './Patient.entity';
import { Employee } from './Employe.entity';
import { Treatment } from './Treatments.entity';
import { Rating } from './Ratings.entity';

@Entity({name:'appointments'})
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
  cancellation_reason?: string;

  // Relación N:1 con Pacient
  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  // Relación N:1 con employe
  @ManyToOne(() => Employee, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'employee_id' })
  doctor!: Employee;

  @OneToOne(() => Treatment, (treatment) => treatment.appointment)
  treatment!: Treatment;

   // Relación One-to-Many (1 cita puede tener múltiples calificaciones)
   @OneToMany(() => Rating, (rating) => rating.appointment)
   ratings!: Rating[];
}