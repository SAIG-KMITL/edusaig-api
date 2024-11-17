import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ChatRoomService } from '../chat-room.service';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatRoomOwnershipGuard implements CanActivate {
    constructor(
        private readonly chatRoomService: ChatRoomService,
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: AuthenticatedRequest = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const chatRoomId = request.params.id;

        const chatRoom = await this.chatRoomService.findOne({ where: { id: chatRoomId } });
        const course = chatRoom.chapter.module.course;
        const enrollment = await this.enrollmentRepository.findOne({
            where: {
                user: { id: userId },
                course: { id: course.id },
            },
        });
        if (!enrollment)
            throw new NotFoundException('You are not enrolled in this course');

        return true;
    }
}