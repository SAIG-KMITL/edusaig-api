import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOccupationController } from './user-occupation.controller';
import { UserOccupation } from './user-occupation.entity';
import { UserOccupationService } from './user-occupation.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOccupation])],
  controllers: [UserOccupationController],
  providers: [UserOccupationService],
})
export class UserOccupationModule {}
