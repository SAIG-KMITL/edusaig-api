import { PartialType } from '@nestjs/swagger';
import { CreateUserBackground } from './create-user-background.dto';

export class UpdateUserBackground extends PartialType(CreateUserBackground) {}
