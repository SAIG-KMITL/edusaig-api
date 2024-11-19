import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChatMessageType } from './enums/chat-message-type.enum';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
  })
  content: string;

  @OneToOne(() => ChatMessage, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reply' })
  reply?: ChatMessage;

  @Column({
    nullable: false,
    default: false,
  })
  isEdited: boolean;

  @Column({
    type: 'enum',
    enum: ChatMessageType,
    nullable: false,
  })
  type: ChatMessageType;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatMessages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'chat_room_id' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;
}
