import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"; 
import { Person } from "./Person.entity";

@Entity({name:'emergency_contacts'})
export class EmergencyContact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:'varchar', nullable:false})
    name!: string;

    @Column({type:'varchar', nullable:false})
    phone!: string;

    @ManyToOne(() => Person, (person) => person.emergencyContacts)
    @JoinColumn({name:'person_id'})
    person!: Person;

}