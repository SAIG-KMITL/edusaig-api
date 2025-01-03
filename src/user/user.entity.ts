import { Course } from 'src/course/course.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { Roadmap } from 'src/roadmap/roadmap.entity';
import { Role } from 'src/shared/enums/roles.enum';
import { UserBackground } from 'src/user-background/user-background.entity';
import { UserStreak } from 'src/user-streak/user-streak.entity';
import { UserReward } from 'src/user-reward/user-reward.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pretest } from 'src/pretest/pretest.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
  })
  fullname: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
    default: Role.STUDENT,
  })
  role: Role;

  @OneToMany(() => UserBackground, (background) => background.user)
  backgrounds: UserBackground[];

  @OneToMany(() => Roadmap, (roadmap) => roadmap.user)
  roadmaps: Roadmap[];

  @OneToMany(() => UserStreak, (streak) => streak.user)
  streaks: UserStreak[];

  @Column({
    nullable: false,
    unique: true,
  })
  password: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: true,
    default: 0,
  })
  points: number;

  @OneToMany(() => Course, (course) => course.teacher, {
    nullable: true,
  })
  courses: Course[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user, {
    nullable: true,
  })
  enrollments: Enrollment[];

  @OneToMany(() => Pretest, (pretest) => pretest.user, {
    cascade: true,
    nullable: true,
  })
  pretest: Pretest[];

  @OneToMany(() => ExamAttempt, (examAttempt) => examAttempt.user, {
    cascade: true,
    nullable: true,
  })
  examAttempt: ExamAttempt[];

  @OneToMany(() => UserReward, (userReward) => userReward.user, {
    nullable: true,
  })
  rewards: UserReward[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  profileKey: string;
}
