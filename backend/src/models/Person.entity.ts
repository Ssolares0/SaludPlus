// models/Person.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './User.entity';

@Entity({name:"people"})
export class Person {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  first_name!: string;

  @Column({ type: 'varchar', length: 100 })
  last_name!: string;

  @Column({ type: 'varchar', unique: true })
  national_id!: string | null;

  @Column({ type: 'varchar', unique: true })
  email!: string | null;

  @Column({type: 'date'})
  birth_date!: Date | null;

  @Column({type: 'char', length:1 })
  gender!: string | null;

  @Column({type: 'varchar', length:20})
  phone!: string | null;

  @Column({type:'varchar', length: 200})
  address!: string | null;

  @Column({type: 'datetime'})
  updated_at!: Date | null

  @OneToOne(() => User, (user) => user.person)
  user!: User;
}
