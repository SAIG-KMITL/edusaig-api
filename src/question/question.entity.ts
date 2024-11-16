import { Exam } from "src/exam/exam.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
@Entity()
@Unique(["examId", "orderIndex"])
export class Question {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Exam, (exam) => exam.question, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    @JoinColumn({ name: 'exam_id' })
    exam: Exam;

    @Column({ name: 'exam_id' })
    examId: string;

    @Column({
        nullable: false,
    })
    question: string;

    @Column({
        nullable: false,
    })
    type: string;

    @Column({
        nullable: false,
        default: 0,
    })
    points: number;

    @Column({
        nullable: false,
        default: 1,
    })
    orderIndex: number;

    @CreateDateColumn({
        type: "timestamp with time zone"
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp with time zone"
    })
    updatedAt: Date;
}