import { Entity } from "typeorm";
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Roles } from "src/shared/enums/roles.enum";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "string",
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        type: "enum",
        enum: Roles,
        nullable: false,
    })
    role: Roles;

    @Column({
        type: "string",
        nullable: false,
        unique: true,
    })
    password: string;

    @Column({
        type: "string",
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