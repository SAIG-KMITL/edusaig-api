import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { CourseModule } from 'src/course-module/course-module.entity';
import { Progress } from 'src/progress/progress.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Chapter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: String,
    nullable: false,
  })
  title: string;

  @Column({
    type: String,
    nullable: false,
  })
  description: string;

  @ManyToOne(() => CourseModule, (module) => module.chapters, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;
  @Column({ name: 'module_id' })
  moduleId: string;

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.chapter)
  chatRooms: ChatRoom[];

  @OneToMany(() => Progress, (progress) => progress.chapter)
  progresses: Progress[];

  @Column({
    type: String,
    nullable: true,
  })
  videoKey: string;

  @Column({
    type: String,
    nullable: false,
  })
  content: string;

  @Column({
    type: String,
    nullable: true,
  })
  summary: string;

  @Column({
    type: Number,
    nullable: false,
  })
  duration: number;

  @Column({
    type: Number,
    nullable: false,
  })
  orderIndex: number;

  @Column({
    type: Boolean,
    nullable: false,
    default: true,
  })
  isPreview: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
