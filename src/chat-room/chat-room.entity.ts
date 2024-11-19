import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Chapter } from 'src/chapter/chapter.entity';
import { ChatRoomType, ChatRoomStatus } from './enums';
import { ChatMessage } from 'src/chat-message/chat-message.entity';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Chapter, (chapter) => chapter.chatRooms, {
        onDelete: 'CASCADE',
        nullable: false,
        eager: true,
    })
    @JoinColumn({ name: 'chapter_id' })
    chapter: Chapter;

    @Column({
        nullable: false,
    })
    title: string;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ChatRoomType,
        default: ChatRoomType.QUESTION,
    })
    type: ChatRoomType;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ChatRoomStatus,
        default: ChatRoomStatus.ACTIVE,
    })
    status: ChatRoomStatus;

    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date;

    @Column({
        default: 0,
        type: 'int',
    })
    participantCount: number;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date;

    @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chatRoom)
    chatMessages: ChatMessage[];
}
