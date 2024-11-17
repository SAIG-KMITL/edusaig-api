import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Chapter } from 'src/chapter/chapter.entity';
import { CourseModule } from 'src/course-module/course-module.entity';
import { Course } from 'src/course/course.entity';
import { Repository } from 'typeorm';
import { CourseStatus, Role } from '../enums';
import { ADMIN_DRAFT_ONLY_KEY, COURSE_OWNERSHIP_KEY } from '../decorators/course-ownership.decorator';


type ResourceType = 'course' | 'module' | 'chapter';

@Injectable()
export class CourseOwnershipGuard implements CanActivate {
  private readonly pathToType: Record<string, ResourceType> = {
    '/course/': 'course',
    '/course-module/': 'module',
    '/chapter/': 'chapter'
  };

  constructor(
    private reflector: Reflector,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(CourseModule)
    private moduleRepo: Repository<CourseModule>,
    @InjectRepository(Chapter)
    private chapterRepo: Repository<Chapter>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.isOwnershipRequired(context)) return true;

    const { user, params, path } = this.getRequestData(context);
    const course = await this.getCourse(path, params.id);

    if (!course) throw new UnauthorizedException('Course not found');

    if (user.role === Role.ADMIN) {
      return this.validateAdminAccess(context, course);
    }

    if (user.role === Role.TEACHER) {
      return this.validateTeacherAccess(user.id, course);
    }

    throw new UnauthorizedException('Insufficient permissions');
  }

  private isOwnershipRequired(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(COURSE_OWNERSHIP_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
  }

  private getRequestData(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return { user: request.user, params: request.params, path: request.path };
  }

  private async getCourse(path: string, id: string): Promise<Course | null> {
    const type = Object.entries(this.pathToType)
      .find(([key]) => path.includes(key))?.[1];
    
    if (!type) return null;

    const queries = {
      course: () => this.courseRepo.findOne({
        where: { id },
        relations: { teacher: true }
      }),
      module: () => this.moduleRepo.findOne({
        where: { id },
        relations: { course: { teacher: true } }
      }).then(m => m?.course),
      chapter: () => this.chapterRepo.findOne({
        where: { id },
        relations: { module: { course: { teacher: true } } }
      }).then(c => c?.module?.course)
    };

    return await queries[type]().catch(() => null);
  }

  private validateAdminAccess(context: ExecutionContext, course: Course): boolean {
    const adminDraftOnly = this.reflector.getAllAndOverride<boolean>(ADMIN_DRAFT_ONLY_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (adminDraftOnly && course.status !== CourseStatus.DRAFT) {
      throw new UnauthorizedException('Admin can only access draft courses');
    }
    return true;
  }

  private validateTeacherAccess(userId: string, course: Course): boolean {
    console.log(course.teacher.id);
    console.log(course);
    console.log(userId);
    if (course.teacher.id !== userId) {
      throw new UnauthorizedException('You can only access your own courses');
    }
    return true;
  }
}