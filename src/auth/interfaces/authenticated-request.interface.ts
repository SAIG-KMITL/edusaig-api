import { JwtPayloadDto } from '../dtos/jwt-payload.dto';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: JwtPayloadDto;
}
