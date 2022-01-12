import { Controller, Body, Get, Param, Post } from '@nestjs/common';
import { Clothes } from '@prisma/client';
import { ClothesService } from './clothes.service';
import { AddClothesDto } from './dto/add-clothes.dto';
import { AddManyClothesDto } from './dto/add-many-clothes.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('clothes')
@Controller('clothes')
export class ClothesController {
  constructor(private service: ClothesService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Adicionar uma peça',
  })
  create(@Body() data: AddClothesDto): Promise<Clothes> {
    return this.service.create(data);
  }

  @Post('createMany')
  @ApiOperation({
    summary: 'Adicionar várias peças',
  })
  async createMany(@Body() data: AddManyClothesDto) {
    return this.service.createMany(data);
  }

  @Get('findMany')
  @ApiOperation({
    summary: 'Todas as peças disponíveis',
  })
  findMany(): Promise<Clothes[]> {
    return this.service.findMany();
  }

  @Get('find/:id')
  @ApiOperation({
    summary: 'Busque uma peça específica por seu ID',
  })
  async findUnique(@Param('id') id: string): Promise<Clothes> {
    return this.service.findUnique(id);
  }
}
