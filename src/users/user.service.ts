import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Users } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DtoUser } from './dto/user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private database: PrismaService) {}

  async create(data: DtoUser): Promise<Users> {
    const auth = await this.database.users.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            nickname: data.nickname,
          },
        ],
      },
    });

    if (auth) {
      throw new ConflictException('Dados já cadastrados');
    }

    if (data.password !== data.passwordConfirmation) {
      throw new ConflictException('Senhas não conferem');
    }

    delete data.passwordConfirmation;

    const hashPassword = await bcrypt.hash(data.password, 10);
    const user = await this.database.users.create({
      data: {
        ...data,
        password: hashPassword,
      },
    });

    delete user.password;
    return user;
  }

  async UserList(UsersID: string) {
    const clothes = await this.database.users.findUnique({
      where: { id: UsersID },
      include: {
        clothes: true,
      },
    });
    return clothes;
  }

  async addToCart(user: Users, clothesID: string) {
    const clothe = await this.database.clothes.findUnique({
      where: { id: clothesID },
    });

    if (!clothe) {
      throw new NotFoundException('Item não encontrado');
    }

    const userFavItem = await this.database.users.findUnique({
      where: { id: user.id },
      include: {
        clothes: true,
      },
    });

    const userClothesList = userFavItem.clothes;
    let foundCLothes = false;

    userClothesList.map((clothe) => {
      if (clothe.id === clothesID) {
        foundCLothes = true;
      }
    });

    if (foundCLothes) {
      await this.database.users.update({
        where: { id: user.id },
        data: {
          clothes: {
            disconnect: {
              id: clothe.id,
            },
          },
        },
      });
      return { message: 'Jogo removido da lista' };
    } else {
      await this.database.users.update({
        where: { id: user.id },
        data: {
          clothes: {
            connect: {
              id: clothe.id,
            },
          },
        },
      });
      return { message: 'Jogo adicionado a lista' };
    }
  }
}
