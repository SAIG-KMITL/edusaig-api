import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Chapter } from "src/chapter/chapter.entity";
import { ChatRoomType, ChatRoomStatus } from "./enums";

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => Chapter, {
        onDelete: "CASCADE",
        nullable: false,
        eager: true,
    })
    @JoinColumn({ name: "chapter_id" })
    chapter: Chapter;

    @Column({
        nullable: false,
    })
    title: string;

    @Column({
        nullable: false,
        type: "enum",
        enum: ChatRoomType,
        default: ChatRoomType.QUESTION,
    })
    type: ChatRoomType;

    @Column({
        nullable: false,
        type: "enum",
        enum: ChatRoomStatus,
        default: ChatRoomStatus.ACTIVE,
    })
    status: ChatRoomStatus;

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