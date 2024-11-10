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
        type: "timestamp with time zone",
        default: () => "CURRENT_TIMESTAMP",
    })
    lastActivityDate: Date;

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