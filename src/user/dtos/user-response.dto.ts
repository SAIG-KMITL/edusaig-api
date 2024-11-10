import { Role } from "src/shared/enums/roles.enum";
import { User } from "../user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty({
        description: 'User ID',
        type: String,
        example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
    })
    id: string;

    @ApiProperty({
        description: 'User email',
        type: String,
        example: 'johndoe@gmail.com',
    })
    email: string;

    @ApiProperty({
        description: 'User role',
        type: String,
        example: Role.STUDENT,
        enum: [Role.STUDENT, Role.TEACHER],
    })
    role: Role;

    @ApiProperty({
        description: 'User created date',
        type: Date,
        example: new Date(),
    })
    createdAt: Date;

    @ApiProperty({
        description: 'User updated date',
        type: Date,
        example: new Date(),
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'User fullname',
        type: String,
        example: 'John Doe',
    })
    fullname: string;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.fullname = user.fullname;
    }
}