import { CourseModule } from 'src/course-module/course-module.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
    nullable: false,
  })
  title: string;

  @Column({
    type: String,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => CourseModule, (module) => module.chapters, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;

  @Column({ name: 'module_id' })
  moduleId: string;

  @Column({
    type: String,
    nullable: false,
  })
  videoUrl: string;

  @Column({
    type: String,
    nullable: false,
  })
  content: string;

  @Column({
    type: String,
    nullable: false,
  })
  summary: string;

  @Column({
    type: Number,
    nullable: false,
  })
  duration: number;

  @Column({
    type: Number,
    nullable: false,
  })
  orderIndex: number;

  @Column({
    type: Boolean,
    nullable: false,
    default: true,
  })
  isPreview: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
