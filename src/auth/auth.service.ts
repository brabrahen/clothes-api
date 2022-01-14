import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, AuthResponse } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private database: PrismaService, private jwt: JwtService) {}

  async login(data: LoginDto): Promise<AuthResponse> {
    const { email, password } = data;
    const users = await this.database.users.findUnique({ where: { email } });

    if (!users) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const hashValid = await bcrypt.compare(password, users.password);

    if (!hashValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    delete users.password;

    return {
      token: this.jwt.sign({ email }),
      users,
    };
  }
}
