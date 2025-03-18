import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User.entity';

@Entity({name:'roles'})
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string; // Ej: 'paciente', 'médico', 'admin'

  // Relación Uno a Muchos (1 Rol → N Usuarios)
  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}