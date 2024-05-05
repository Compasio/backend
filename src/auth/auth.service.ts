import {
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService
    ) {}
  
    async signInUser(email: string, password: string) {
      const user = await this.userService.getUserByEmail(email);
      if(!user) throw new UnauthorizedException('Usuário não existe');
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        const payload = { id: user.id_user, email: user.email };
        return await this.jwtService.signAsync(payload);
      } else {
        throw new UnauthorizedException('Senha incorreta');
      }
    }
  }
