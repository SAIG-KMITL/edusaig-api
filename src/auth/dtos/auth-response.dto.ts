import { UserResponseDto } from 'src/user/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Access token',
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token',
    type: String,
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
