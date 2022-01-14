import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AddClothesDto } from './dto/add-clothes.dto';
import { AddManyClothesDto } from './dto/add-many-clothes.dto';
import { Clothes } from '@prisma/client';

@Injectable()
export class ClothesService {
  constructor(private database: PrismaService) {}

  async create(data: AddClothesDto): Promise<Clothes> {
    const clothes = await this.database.clothes.create({
      data,
    });
    return clothes;
  }

  async createMany(data: AddManyClothesDto) {
    const addClothes = [];

    data.clothes.map(async (clothes) => {
      const exists = await this.findPerName(clothes.name);

      if (!exists) {
        const created = await this.create(clothes);
        addClothes.push(created);
      }
    });
    return addClothes;
  }

  async findPerName(name: string): Promise<Clothes> {
    const cloth = await this.database.clothes.findFirst({
      where: { name: name },
    });
    return cloth;
  }

  async findMany(): Promise<Clothes[]> {
    const clothes = await this.database.clothes.findMany();
    return clothes;
  }

  async findUnique(id: string): Promise<Clothes> {
    const cloth = await this.database.clothes.findUnique({
      where: { id },
    });

    if (!cloth) {
      throw new NotFoundException('A ID nao foi localizada');
    }
    return cloth;
  }
}
