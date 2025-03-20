import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CryptoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pair: string;

  @Column('decimal')
  price: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}