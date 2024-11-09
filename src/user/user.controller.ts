import {
    Controller,
    Injectable,
    Get,
    Req,
    Param,
    ParseUUIDPipe,
    HttpStatus,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('user')
@Injectable()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    async getProfile(
        @Req() request: AuthenticatedRequest,
    ): Promise<UserResponseDto> {
        const user = await this.userService.findOne({
            where: { id: request.user.id },
        });
        return new UserResponseDto(user);
    }

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll();
        return users.map((user) => new UserResponseDto(user));
    }

    @Get(':id')
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
}
