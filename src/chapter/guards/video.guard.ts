import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from 'src/auth/dtos/jwt-payload.dto';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { Role } from 'src/shared/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from '../chapter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VideoGuard implements CanActivate {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const chapterId = request.params.id;
    const chapter = await this.chapterRepository.findOne({
      where: { id: chapterId },
      relations: {
        module: {
          course: {
            teacher: true,
          },
        },
      }
    });
    if (!chapter) throw new NotFoundException('Chapter not found');
    if (chapter.isPreview) return true;
    const token = request.query.token as string;
    if (!token) throw new UnauthorizedException('Unauthorized access');
    try {
      request.user = await this.jwtService.verifyAsync<JwtPayloadDto>(token, {
        secret: this.configService.getOrThrow<string>(
          GLOBAL_CONFIG.JWT_ACCESS_SECRET,
        ),
      });
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access');
    }
    const userId = request.user.id;
    const courseId = chapter.module.course.id;
    switch (request.user.role) {
      case Role.TEACHER:
        if (chapter.module.course.teacher.id !== userId)
          throw new ForbiddenException('Insufficient permissions');
        break;
      case Role.STUDENT:
        const enrollment = await this.enrollmentService.findOne({
          course: { id: courseId },
          user: { id: userId },
        });
        if (!enrollment)
          throw new ForbiddenException('Insufficient permissions');
        break;
      default:
        throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
