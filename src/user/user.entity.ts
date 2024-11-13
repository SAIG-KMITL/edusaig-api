import { Entity, OneToMany } from "typeorm";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Role } from "src/shared/enums/roles.enum";
import { Course } from "src/course/course.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
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
        type: "enum",
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

    @CreateDateColumn({
        type: "timestamp with time zone",
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp with time zone",
        nullable: false,
    })
    updatedAt: Date;
}