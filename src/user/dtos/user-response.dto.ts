import { Roles } from "src/shared/enums/roles.enum";
import { User } from "../user.entity";

export class UserResponseDto {
    id: string;
    email: string;
    role: Roles;
    createdAt: Date;
    updatedAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}