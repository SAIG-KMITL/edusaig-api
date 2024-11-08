import { UserResponseDto } from "src/user/dtos/user-response.dto";

export class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto;
}