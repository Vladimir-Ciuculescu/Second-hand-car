import { IsEmail } from 'class-validator';
import { AfterInsert, AfterRemove, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @AfterRemove()
  logDeletion() {
    console.log(this);
  }

  @AfterInsert()
  logInsertion() {
    console.log(this);
  }
}
