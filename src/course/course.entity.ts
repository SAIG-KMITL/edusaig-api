import { Category } from 'src/category/category.entity';
import { CourseModule } from 'src/course-module/course-module.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { CourseLevel } from 'src/shared/enums/course-level.enum';
import { CourseStatus } from 'src/shared/enums/course-status.enum';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Course {
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => CourseModule, (courseModule) => courseModule.course, {
    cascade: true,
  })
  modules: CourseModule[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];

  @Column({
    type: String,
    nullable: false,
  })
  thumbnail: string;

  @Column({
    type: Number,
    nullable: false,
  })
  duration: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({
    type: Number,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'enum',
    nullable: false,
    enum: CourseStatus,
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

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
