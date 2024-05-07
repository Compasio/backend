import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { PrismaService } from '../../db/prisma.service';
import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Themes_ONG } from '@prisma/client';

@Injectable()
export class OngsService {
  constructor(private prisma: PrismaService) {}

  async createOng(createOngDto: CreateOngDto) {
    const {email, cpf_founder, cnpj_ong} = createOngDto;

    if(cpf_founder.length != 11 || cnpj_ong.length != 14) throw new ConflictException("ERROR: CPF ou CNPJ inválidos");

    const emailExists = await this.prisma.ong.findFirst({
      where: {
        email
      }
    });
    const cpfExists = await this.prisma.ong.findFirst({
      where: {
        cpf_founder
      }
    });
    const cnpjExists = await this.prisma.ong.findFirst({
      where: {
        cnpj_ong
      }
    });

    if(emailExists || cpfExists || cnpjExists) throw new ConflictException("ERROR: Alguns dos dados enviados já existem");
    
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createOngDto.password, salt);

    return this.prisma.ong.create({
      data: {
        ...createOngDto,
        password: hash,
      }
    });
  }

  async getAllOngs(page: number) {
    if(page == 0) {
      const res = await this.prisma.ong.findMany();
      res.forEach(e => delete e.password);
      return res;
    } else if(page == 1) {
      const res = await this.prisma.ong.findMany({take: 20});
      res.forEach(e => delete e.password);
      return res;
    } else {
      const res = await this.prisma.ong.findMany({take: 20, skip: (page - 1) * 20});
      res.forEach(e => delete e.password);
      return res;
    }
  }

  async getOngById(id: number) {
    const ong = await this.prisma.ong.findUnique({
      where: {
        id_ong: id,
      }
    });

    if(!ong) throw new NotFoundException("ERROR: Ong não encontrada");
    delete ong.password;
    return ong;
  }

  async getOngByName(name: string) {
    const ongNearest = await this.prisma.ong.findMany({
      where: {
        OR: [
          {ong_name: { contains: name, mode: 'insensitive' }},
        ]
      }
    });

    if(!ongNearest) throw new NotFoundException('ERROR: Nenhuma ong com esse nome');
    ongNearest.forEach(e => delete e.password);
    return ongNearest;
  }

  async getOngsByTheme(themes: Themes_ONG[]) {
    const ongs = await this.prisma.ong.findMany({
      where: {
        themes: {hasEvery: themes},
      }
    });

    if(ongs[0] === undefined) throw new NotFoundException('ERROR: Nenhuma Ong com estes temas');
    return ongs;
  }

  //TODO --- DEIXAR QUE APENAS ADMIN E PRÓPRIO USUÁRIO CONSIGAM DAR UPDATE NA CONTA
  async updateOng(id: number, updateOngDto: UpdateOngDto) {
    const ong = await this.prisma.ong.findUnique({
      where: {
        id_ong: id,
      }
    });

    if(!ong) throw new NotFoundException("ERROR: Ong não encontrada");

    return this.prisma.ong.update({
      data: {
        ...updateOngDto,
      },
      where: {
        id_ong: id,
      }
    });
  }

  //TODO --- DEIXAR QUE APENAS ADMIN E PRÓPRIO USUÁRIO CONSIGAM DELETAR A CONTA
  async removeOng(id: number) {
    const ong = await this.prisma.ong.findUnique({
      where: {
        id_ong: id,
      }
    });

    if(!ong) throw new NotFoundException("ERROR: Ong não encontrada");

    return this.prisma.ong.delete({
      where: {
        id_ong: id,
      }
    });
  }
}
