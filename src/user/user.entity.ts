import { Course } from 'src/course/course.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Role } from 'src/shared/enums/roles.enum';
import {
<<<<<<< HEAD
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
=======
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
>>>>>>> 95ec4da3bae6ba83f175becb60440f6d278b863e
} from 'typeorm';
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

    @OneToMany(() => Course, (course) => course.teacher)
    courses: Course[];

<<<<<<< HEAD
  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Enrollment[];

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;
=======
    @CreateDateColumn({
        type: 'timestamp with time zone',
        nullable: false,
    })
    createdAt: Date;
>>>>>>> 95ec4da3bae6ba83f175becb60440f6d278b863e

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
