import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Role } from "src/shared/enums/roles.enum";

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
        enum: [Role.STUDENT, Role.TEACHER],
        nullable: false,
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

    @CreateDateColumn({
        type: "timestamp",
        nullable: false,
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        nullable: false,
    })
    updatedAt: Date;
}