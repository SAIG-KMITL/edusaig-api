import { Slug } from 'src/category/enums/slug.enum';
import { Course } from 'src/course/course.entity';
import { Entity, OneToMany } from 'typeorm';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  title: string;

  @Column()
  description: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: Slug,
  })
  slug: Slug;

  @OneToMany(() => Course, (course) => course.category)
  courses: Course[];


  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;
}
