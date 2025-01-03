import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserStreakModule } from 'src/user-streak/user-streak.module';

@Module({
  imports: [UserModule, UserStreakModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
