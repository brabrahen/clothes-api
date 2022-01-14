import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [UserController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
