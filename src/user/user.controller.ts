import {
    Controller,
    Injectable,
    Get,
    Req,
    Param,
    ParseUUIDPipe,
    HttpStatus,
    Patch,
    Body,
    Delete,
    HttpCode,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user-response.dto';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Role } from 'src/shared/enums/roles.enum';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@Injectable()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: 'Get user profile',
    })
    async getProfile(
        @Req() request: AuthenticatedRequest,
    ): Promise<UserResponseDto> {
        const user = await this.userService.findOne({
            where: { id: request.user.id },
        });
        return new UserResponseDto(user);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: 'Get all users',
        isArray: true,
    })
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll();
        return users.map((user) => new UserResponseDto(user));
    }

    @Get(':id')
    @ApiParam({
        name: 'id',
        type: String,
        description: 'User id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: 'Get user by id',
    })
    @Public()
    async findOne(
        @Param(
            'id',
            new ParseUUIDPipe({
                version: '4',
                errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            }),
        )
        id: string,
    ): Promise<UserResponseDto> {
        const user = await this.userService.findOne({ where: { id } });
        return new UserResponseDto(user);
    }

    @Patch()
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponseDto,
        description: 'Update user',
    })
    async update(
        @Req() request: AuthenticatedRequest,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.userService.update(request.user.id, updateUserDto);
        return new UserResponseDto(user);
    }

    @Delete()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Delete user',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Req() request: AuthenticatedRequest,
    ): Promise<{ massage: string }> {
        await this.userService.delete(request.user.id);
        return { massage: 'User deleted successfully' };
    }
}
