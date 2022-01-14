import {
  Body,
  Controller,
  Patch,
  Post,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { DtoUser } from './dto/user.dto';
import { Users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthUser } from '../auth/auth-user.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private service: UsersService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Criar um usuário',
  })
  create(@Body() data: DtoUser): Promise<Users> {
    return this.service.create(data);
  }

  @UseGuards(AuthGuard())
  @Patch('addList/:id')
  @ApiOperation({
    summary: 'Adicionar uma peça na lista de usuário ou remover',
  })
  @ApiBearerAuth()
  addToCart(@AuthUser() users: Users, @Param('id') clothesId: string) {
    return this.service.addToCart(users, clothesId);
  }
}
