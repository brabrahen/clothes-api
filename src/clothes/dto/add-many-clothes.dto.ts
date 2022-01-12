import { AddClothesDto } from './add-clothes.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddManyClothesDto {
  @IsNotEmpty()
  @ApiProperty()
  clothes: AddClothesDto[];
}
