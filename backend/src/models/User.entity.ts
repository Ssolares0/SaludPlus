import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Role } from './Role.entity';
import { Person } from './Person.entity';

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

  @Column({type:'varchar', nullable:true})
  remember_token?: string;

  @Column({type:'date', nullable:true})
  email_verified_at?: Date;

  @Column({type:'boolean', default: false})
  approved!: boolean;


  // Relación Muchos a Uno (N Usuarios → 1 Rol)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' }) // Nombre de la columna FK en la BD
  role!: Role;

  // Relación Uno a Uno (1 Usuario ↔ 1 Persona)
  @OneToOne(() => Person)
  @JoinColumn({ name: 'person_id' }) // Columna person_id en users
  person!: Person; // TypeORM manejará el ID automáticamente
}