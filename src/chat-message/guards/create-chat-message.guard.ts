import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { Request } from 'express';
import { JwtPayloadDto } from 'src/auth/dtos/jwt-payload.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Role } from 'src/shared/enums';
import { CreateChatMessageDto } from '../dtos';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

@Injectable()
export class CreateChatMessageGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly chatRoomService: ChatRoomService,
        private readonly enrollmentService: EnrollmentService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: AuthenticatedRequest = context.switchToHttp().getRequest();
        const createChatMessageDto = request.body as CreateChatMessageDto;
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Unauthorized access');
        try {
            await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(GLOBAL_CONFIG.JWT_AI_ACCESS_SECRET),
            });
            return true;
        } catch { }
        try {
            request.user = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
                secret: this.configService.get<string>(GLOBAL_CONFIG.JWT_ACCESS_SECRET),
            });
        } catch (error) {
            throw new UnauthorizedException('Unauthorized access');
        }
        if (request.user.role !== Role.STUDENT)
            throw new ForbiddenException('Forbidden access');
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
        await this.enrollmentService.findOne({
            user: { id: request.user.id },
            course: { id: courseId },
        });
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
