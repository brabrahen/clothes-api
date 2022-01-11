import { Module } from '@nestjs/common';
import { ClothesController } from './clothes.controller';
import { ClothesService } from './clothes.service';

@Module({
  controllers: [ClothesController],
  providers: [ClothesService]
})
export class ClothesModule {}
