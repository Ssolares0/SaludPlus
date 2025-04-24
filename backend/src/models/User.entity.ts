import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from './Role.entity';
import { Person } from './Person.entity';
import { Reports } from './Reports.entity';

@Entity({name:'users'})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'varchar', nullable: false})
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'bytea' }) //(contraseña encriptada)
  password!: Buffer;

  @Column({type:'bytea', nullable:true})
  remember_token?: Buffer;

  @Column({type:'varchar', nullable:true})
  token_email_verified?: string;

  @Column({type:'boolean', default: false})
  approved!: boolean | null;

  @Column({type:'boolean', default: false})
  email_verification_token!: boolean | null;


  // Relación Muchos a Uno (N Usuarios → 1 Rol)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' }) // Nombre de la columna FK en la BD
  role!: Role;

  // Relación Uno a Uno (1 Usuario ↔ 1 Persona)
  @OneToOne(() => Person)
  @JoinColumn({ name: 'person_id' }) // Columna person_id en users
  person!: Person; // TypeORM manejará el ID automáticamente

  //relacion con reportes 
  @OneToMany(() => Reports, (report) => report.reporter)
  reportsMade!: Reports[]

  @OneToMany(() => Reports, (report) => report.reported)
  reportsReceived!: Reports[]
}