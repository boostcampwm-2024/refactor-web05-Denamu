import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tag' })
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    nullable: false,
    unique: true,
  })
  name: string;
}
