import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Role } from './Role.entity';
import { Person } from './Person.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'bytea' }) //(contraseña encriptada)
  password!: Buffer;

  // Relación Muchos a Uno (N Usuarios → 1 Rol)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' }) // Nombre de la columna FK en la BD
  role!: Role;

  // Relación Uno a Uno (1 Usuario ↔ 1 Persona)
  @OneToOne(() => Person)
  @JoinColumn({ name: 'person_id' }) // Columna person_id en users
  person!: Person; // TypeORM manejará el ID automáticamente
}