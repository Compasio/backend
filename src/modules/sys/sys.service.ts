import { CreateAdminDto } from './dto/create-admin.dto';
import { PrismaService } from '../../db/prisma.service';
import { Habilities_User } from '@prisma/client';
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
    let hab: string[] = [];
    for (let i of Object.entries(Habilities_User)) {
      hab.push(i[0]);
    }
    return {"habilities": hab};
  }

  findAll() {
    return `This action returns all sys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sy`;
  }
  
  remove(id: number) {
    return `This action removes a #${id} sy`;
  }
}
