import { Course } from 'src/course/course.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EnrollmentStatus } from './enums/enrollment-status.enum';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status: EnrollmentStatus;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  completionRate: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  certificateIssued: boolean;

  @Column({
    type: 'timestamp',
    name: 'enrolled_at',
  })
  enrolledAt: Date;

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
