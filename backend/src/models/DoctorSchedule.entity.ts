import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employe.entity';

@Entity()
export class DoctorSchedule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'smallint' })
  day_of_week!: number; // 1=Lunes, 2=Martes, ..., 7=Domingo

  @Column({ type: 'time' })
  start_time!: string; // Formato HH:MM:SS

  @Column({ type: 'time' })
  end_time!: string;

  // Relación N:1 con Médico (Employee)
  @ManyToOne(() => Employee, (doctor) => doctor.schedules)
  @JoinColumn({ name: 'employee_id' })
  doctor!: Employee;
}