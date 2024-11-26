import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PretestService } from './pretest.service';
import {
  PaginatedPretestResponseDto,
  PretestResponseDto,
} from './dtos/pretest-response.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreatePretestDto } from './dtos/create-pretest.dto';
import { UpdatePretestDto } from './dtos/update-pretest.dto';

@Controller('pretest')
@ApiTags('Pretest')
@ApiBearerAuth()
@Injectable()
export class PretestController {
  constructor(private readonly pretestService: PretestService) {}
  @Get()
  @Roles(Role.STUDENT)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all pretests',
    type: PaginatedPretestResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
  })
  async findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedPretestResponseDto> {
    return await this.pretestService.findAll(
      request.user.id,
      request.user.role,
      {
        page: query.page,
        limit: query.limit,
        search: query.search,
      },
    );
  }

  @Get(':id')
  @Roles(Role.STUDENT)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a pretest',
    type: PretestResponseDto,
  })
  async findOne(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<PretestResponseDto> {
    const pretest = await this.pretestService.findOne(
      request.user.id,
      request.user.role,
      { where: { id } },
    );
    return new PretestResponseDto(pretest);
  }

  @Post()
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a pretest',
    type: PretestResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async createPretest(
    @Req() request: AuthenticatedRequest,
    @Body() createPretestDto: CreatePretestDto,
  ): Promise<PretestResponseDto> {
    const pretest = await this.pretestService.createPretest(
      request.user.id,
      createPretestDto,
    );
    return new PretestResponseDto(pretest);
  }

  @Patch(':id')
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a pretest',
    type: PretestResponseDto,
  })
  async updatePretest(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updatePretestDto: UpdatePretestDto,
  ): Promise<PretestResponseDto> {
    const pretest = await this.pretestService.updatePretest(
      request.user.id,
      request.user.role,
      id,
      updatePretestDto,
    );
    return new PretestResponseDto(pretest);
  }

  @Delete(':id')
  @Roles(Role.STUDENT)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete a pretest',
    type: PretestResponseDto,
  })
  async deleteExam(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<PretestResponseDto> {
    const pretest = await this.pretestService.deletePretest(
      request.user.id,
      request.user.role,
      id,
    );
    return new PretestResponseDto(pretest);
  }

  @Get('pretest/test')
  async test(@Req() request: AuthenticatedRequest): Promise<void> {
    this.pretestService.fetchData(request.user.id);
  }
}
