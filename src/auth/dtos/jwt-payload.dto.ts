import { Role } from 'src/shared/enums/roles.enum';

export class JwtPayloadDto {
  id: string;
  role: Role;
}
