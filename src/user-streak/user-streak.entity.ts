import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class UserStreak {
    @PrimaryGeneratedColumn("uuid")
    @ApiProperty({
        description: 'User streak ID',
        type: String,
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    id: string;

    @OneToOne(() => User)
    @JoinColumn()
    @ApiProperty({
        description: 'User',
        type: User,
    })
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