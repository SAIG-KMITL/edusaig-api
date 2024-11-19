import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Role } from 'src/shared/enums';
import { CreateChatMessageDto } from '../dtos';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

@Injectable()
export class CreateChatMessageGuard implements CanActivate {
    constructor(
        private readonly chatRoomService: ChatRoomService,
        private readonly enrollmentService: EnrollmentService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: AuthenticatedRequest = context.switchToHttp().getRequest();
        if (request.user.role === Role.STUDENT) {
            const createChatMessageDto = request.body as CreateChatMessageDto;
            const chatRoom = await this.chatRoomService.findOne({
                where: { id: createChatMessageDto.chatRoomId },
                relations: {
                    chapter: {
                        module: {
                            course: true,
                        },
                    }
                }
            });
            const courseId = chatRoom.chapter.module.course.id;
            try {
                await this.enrollmentService.findOne({
                    user: { id: request.user.id },
                    course: { id: courseId },
                });
            } catch {
                throw new ForbiddenException('You are not enrolled in this course');
            }
        }
        return true;
    }
}
