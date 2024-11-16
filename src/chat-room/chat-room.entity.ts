import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { Chapter } from "src/chapter/chapter.entity";

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @OneToOne(() => Chapter, { onDelete: "CASCADE" })
    chapter: Chapter;

    @Column({
        nullable: false,
    })
    title: string;

    @Column({
        nullable: false,
    })
    type: string;

    @Column({
        nullable: false,
    })
    status: string;

    @CreateDateColumn({
        type: "timestamp",
    })
    createdAt: Date;

    @Column({
        nullable: false,
        default: 0,
        type: "int",
    })
    participantCount: number;

    @UpdateDateColumn({
        type: "timestamp",
    })
    updatedAt: Date;
}