import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class UserStreak {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({
        default: 0,
        nullable: false,
    })
    currentStreak: number;

    @Column({
        default: 0,
        nullable: false,
    })
    longestStreak: number;

    @Column({
        type: "timestamp",
    })
    lastActivityDate: Date;

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