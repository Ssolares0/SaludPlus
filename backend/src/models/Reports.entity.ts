// src/entities/Report.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

@Entity({name:"reports"})
export class Reports {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación con el usuario que realiza el reporte (reporter)
  @ManyToOne(() => User, (user) => user.reportsMade)
  @JoinColumn({ name: 'reporter_id' })
  reporter!: User;

  // Relación con el usuario reportado (reported)
  @ManyToOne(() => User, (user) => user.reportsReceived)
  @JoinColumn({ name: 'reported_id' })
  reported!: User;

  @Column({ type: 'varchar', length: 50 })
  category!: string; // Ej: "conducta", "profesionalismo", "incumplimiento"

  @Column({ type: 'text' })
  description!: string;

}