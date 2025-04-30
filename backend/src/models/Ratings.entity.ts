// src/entities/Rating.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Appointment } from './Appointments.entity';

// Enum para roles válidos del evaluador
export enum RaterRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

@Entity({ name: 'ratings' })
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación Many-to-One con Cita (Muchas calificaciones pertenecen a una cita)
  @ManyToOne(() => Appointment, (appointment) => appointment.ratings)
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  // Rol del evaluador (médico o paciente)
  @Column({ type: 'varchar'  })
  rater_role!: RaterRole;

  // Calificación numérica (ej: escala 1-5)
  @Column({ type: 'decimal'})
  rating!: number;

  // Comentario opcional
  @Column({ type: 'text'})
  comment?: string;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at'
  })
  createdAt!: Date;
}