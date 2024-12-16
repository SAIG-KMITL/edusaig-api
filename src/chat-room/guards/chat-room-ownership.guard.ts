import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ChatRoomService } from '../chat-room.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { Role } from 'src/shared/enums';

@Injectable()
export class ChatRoomOwnershipGuard implements CanActivate {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const chatRoomId = request.params.id;
    switch (request.user.role) {
      case Role.STUDENT:
        const chatRoom = await this.chatRoomService.findOne({
          where: { id: chatRoomId },
          relations: {
            chapter: {
              module: {
                course: true,
              },
            },
          },
        });
        const course = chatRoom.chapter.module.course;
        const enrollment = await this.enrollmentService.findOne({
          user: { id: request.user.id },
          course: { id: course.id },
        });
        if (!enrollment)
          throw new NotFoundException('You are not enrolled in this course');
        break;
      case Role.TEACHER:
        const teacher = await this.chatRoomService.findOne({
          where: { id: chatRoomId },
          relations: {
            chapter: {
              module: {
                course: {
                  teacher: true,
                },
              },
            },
          },
        });
        if (teacher.chapter.module.course.teacher.id !== userId)
          throw new NotFoundException(
            'You are not the owner of this chat room',
          );
        break;
      default:
        throw new ForbiddenException(
          'You are not allowed to access this resource',
        );
    }
    return true;
  }
}
