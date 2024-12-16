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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { CreateRoadmapDto, RoadmapResponseDto } from './dtos';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapAiDto } from './dtos/create-roadmp-ai.dto';

@Controller('roadmap')
@Injectable()
@ApiTags('Roadmap')
@ApiBearerAuth()
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all roadmaps',
    type: RoadmapResponseDto,
    isArray: true,
  })
  @Roles(Role.ADMIN)
  async findAll(@Query() query: PaginateQueryDto) {
    return await this.roadmapService.findAll({
      ...query,
    });
  }

  @Get('/user')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all roadmaps by user id',
    type: RoadmapResponseDto,
    isArray: true,
  })
  @Roles(Role.STUDENT)
  @Roles(Role.ADMIN)
  async findAllByUser(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ) {
    return await this.roadmapService.findAll({
      userId: request.user.id,
      ...query,
    });
  }
  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a roadmap by id',
    type: RoadmapResponseDto,
  })
  @Roles(Role.STUDENT)
  @Roles(Role.ADMIN)
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ) {
    return await this.roadmapService.findOne({ where: { id } });
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates a new roadmap',
    type: RoadmapResponseDto,
  })
  @Roles(Role.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() createRoadmapDto: CreateRoadmapAiDto,
  ) {
    return await this.roadmapService.create(request.user.id, createRoadmapDto);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates a roadmap by id',
    type: RoadmapResponseDto,
  })
  @Roles(Role.STUDENT)
  @Roles(Role.ADMIN)
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
    @Body() updateRoadmapDto: CreateRoadmapDto,
  ) {
    return await this.roadmapService.update({ id }, updateRoadmapDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deletes a roadmap by id',
    type: RoadmapResponseDto,
  })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
      }),
    )
    id: string,
  ) {
    return await this.roadmapService.delete({ id });
  }
}
