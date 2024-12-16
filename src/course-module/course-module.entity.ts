import { Chapter } from 'src/chapter/chapter.entity';
import { Course } from 'src/course/course.entity';
import { Exam } from 'src/exam/exam.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CourseModule {
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

  @Column({
    type: Number,
    nullable: false,
  })
  orderIndex: number;

  @OneToMany(() => Chapter, (chapter) => chapter.module)
  chapters: Chapter[];

  @ManyToOne(() => Course, (course) => course.modules, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: string;

  @OneToOne(() => Exam, (exam) => exam.courseModule, {
    cascade: true,
  })
  exam: Exam;

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
