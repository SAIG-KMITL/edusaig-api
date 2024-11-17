import { Controller, Injectable } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExamAnswerService } from './exam-answer.service';

@Controller('exam')
@ApiTags('Exam')
@ApiBearerAuth()
@Injectable()
export class ExamController {
  constructor(private readonly examAnswerService: ExamAnswerService) {}
}
