import { Entity, PrimaryGeneratedColumn,Column ,OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Person } from './Person.entity';
import { Appointment } from './Appointments.entity';
import { PatientDepartment } from './PatientDepartment.entity';

@Entity({name:'patients'})
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  insurance_number?: string; // Número de seguro médico (opcional)

  // Relación 1:1 con Persona (Un paciente es una persona)
  @OneToOne(() => Person)
  @JoinColumn({ name: 'person_id' })
  person!: Person;

  // Relación 1:N con Citas (Un paciente tiene muchas citas)
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments!: Appointment[];

  @OneToMany(() => PatientDepartment, (patientDepartment)=> patientDepartment.patient)
  department!: PatientDepartment[];
  // Campos adicionales específicos del paciente (si los hay)

}