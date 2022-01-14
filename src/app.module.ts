import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ClothesModule } from './clothes/clothes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, ClothesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}