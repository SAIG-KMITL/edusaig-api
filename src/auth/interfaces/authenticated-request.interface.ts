import { JwtPayloadDto } from '../dtos/jwt-payload.dto';

export interface AuthenticatedRequest extends Request {
  user: JwtPayloadDto;
}
