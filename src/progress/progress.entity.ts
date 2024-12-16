import { Chapter } from 'src/chapter/chapter.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProgressStatus } from './enums/progress-status.enum';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Enrollment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;
  @Column({ name: 'enrollment_id' })
  enrollmentId: string;

  @ManyToOne(() => Chapter, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chapter_id' })
  chapter: Chapter;
  @Column({ name: 'chapter_id' })
  chapterId: string;

  @Column({
    type: 'enum',
    enum: ProgressStatus,
    default: ProgressStatus.ACTIVE,
  })
  status: ProgressStatus;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  watchTime: number;

  @Column({
    type: 'timestamp',
    name: 'last_accessed_at',
  })
  lastAccessedAt: Date;

  @Column({
    type: 'timestamp',
    name: 'completed_at',
    nullable: true,
  })
  completedAt: Date;

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
