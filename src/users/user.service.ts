import { Injectable, ConflictException, NotFoundException } from '@prisma/client';
import { Users, Clothes } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

import * as bcrypt from 'bcrypt';
import { Console } from 'console';
import { transcode } from 'buffer';

@Injectable()
eport class UserService {
    constructor(private database: PrismaService) {}

    async create(data: UserDto): Promise<Users> {
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
        }),

        if (auth) {
            throw new ConflictException('Dados já cadastrados');
        }

        if (data.password !== data.passwordConfirmation){
            throw new ConflictException('Senhas não conferem');
        }

        delete data.passwordConfirmation;

        const hashPassword = await bcrypt.hash(data.password, 10);
        const user = await this.database.users.create({
            data: {
                ...data,
                password: hashPassword,
            },
        }),

        delete user.password;
        return user
    }

    async addToFav(Users, clothesId: string) {
        const clothes = await this.database.clothes.findUnique({
            where: { id: clothesId}
        });

        if(!clothes){
            throw new NotFoundException('Peça não encontrada');
        }

        const addToCart = await this.database.users.findUnique({
            where: { id: Users.id },
            include: {
                clothes: true,
            },
        });

        const userFavList = addToCart.clothes;
        let foundClothes = false;

        userFavList.map((clothes) => {
            if (clothes.id === clothesId){
                foundClothes = true;
            }
        });

        if (foundClothes) {
            await this.database.users.update({
                where: { id: Users.id },
                data: {
                    games: {
                        disconect: {
                            id: clothes.id,
                        },
                    },
                },
            }),
            return { message: 'Peça removida do carrinho' };
        } else {
            await this.database.users.update({
                where: { id: Users.id },
                data: {
                    games: {
                        connect: {
                            id: clothes.id,
                        },
                    },
                },
            }),
            return { message: 'Peça adicionada ao carrinho '}
        }
    }
}