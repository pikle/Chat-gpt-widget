import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ nullable: true })
  fileUrl: string;

  @CreateDateColumn()
  timestamp: Date;
}
