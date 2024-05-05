import { PrismaService } from '../../db/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Habilities_User } from '@prisma/client';
import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  
  async createUser(createUserDto: CreateUserDto) {
    const {email, cpf_user} = createUserDto;
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    const cpfExists = await this.prisma.user.findFirst({
      where: {
        cpf_user,
      },
    });
    if(emailExists) throw new ConflictException("ERROR: Este email já está cadastrado em outra conta");
    if(cpfExists) throw new ConflictException("ERROR: Este CPF já está cadastrado em outra conta");

    //TODO --- CHECAR SE O CPF DO CARA REALMENTE EXISTE (PESQUISAR API PRA ISSO)
    if(createUserDto.cpf_user.length < 11 || createUserDto.cpf_user.length > 11) throw new ConflictException("ERROR: CPF inválido")

    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createUserDto.password, salt);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hash,
      },
    })
  }

  async getAllUsers(page: number) {
    if(page == 0) {
      const res = await this.prisma.user.findMany();
      res.forEach(e => delete e.password);
      return res;
    } else if(page == 1) {
      const res = await this.prisma.user.findMany({take: 20});
      res.forEach(e => delete e.password);
      return res;
    } else {
      const res = await this.prisma.user.findMany({take: 20, skip: (page - 1) * 20});
      res.forEach(e => delete e.password);
      return res;
    }
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id_user: id
      }
    });
    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');
    delete user.password;
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      }
    });
    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');
    return user;
  }

  //TODO --- RESTO DAS FUNÇÕES DE GET
  async getUserByName(name: string) {

  }

  async getUserByHabilities(hability: string[]) {

  }

  //TODO --- DEIXAR QUE APENAS ADMIN E PRÓPRIO USUÁRIO CONSIGAM DAR UPDATE NA CONTA
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id_user: id,
      }
    })
    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');
    return this.prisma.user.update({
      data: {
        ...updateUserDto
      },
      where: {
        id_user: id,
      }
    })
  }

  //TODO --- DEIXAR QUE APENAS ADMIN E PRÓPRIO USUÁRIO CONSIGAM DELETAR A CONTA
  async removeUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id_user: id,
      }
    });
    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');
    return this.prisma.user.delete({
      where: {
        id_user: id,
      }
    });
   }
}
