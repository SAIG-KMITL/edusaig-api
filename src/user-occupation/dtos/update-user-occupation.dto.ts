import { PartialType } from '@nestjs/swagger';
import { CreateUserOccupationDto } from './create-user-occupation.dto';

export class UpdateUserOccupationDto extends PartialType(
  CreateUserOccupationDto,
) {}
