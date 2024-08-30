import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from '../../db/prisma.service';
import { Habilities_User, Themes_ONG } from "@prisma/client";
import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SysService {
  constructor(private prisma: PrismaService) {}

  async createAdmin(createAdminDto: CreateAdminDto) {
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email: createAdminDto.email,
      },
    });
    
    if(emailExists) throw new ConflictException("ERROR: email já cadastrado");

    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createAdminDto.password, salt);

    return this.prisma.user.create({
      data: {
        email: createAdminDto.email,
        password: hash,
        userType: 'admin',
      },
    });
  }

  async getVoluntaryHabilities() {
    return Object.keys(Habilities_User)
  }

  async getOngThemes() {
    return Object.keys(Themes_ONG);
  }

  async addUserToBlackList(id_user: number) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });

    if(!userExists) throw new ConflictException("ERROR: Usuário não existe");

    const check = await this.prisma.userBlackList.findFirst({
      where: {
        id_user,
      },
    });

    if(check) throw new ConflictException("ERROR: Usuário já está na blacklist");

    return this.prisma.userBlackList.create({
      data: {
        id_user,
      },
    });
  }

  async removeUserFromBlackList(id_user: number) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        id: id_user,
      },
    });

    if(!userExists) throw new ConflictException("ERROR: Usuário não existe");

    const check = await this.prisma.userBlackList.findFirst({
      where: {
        id_user,
      },
    });

    if(!check) throw new ConflictException("ERROR: Usuário não está na blacklist");

    return this.prisma.userBlackList.delete({
      where: {
        id_user,
      },
    });
  }
}
