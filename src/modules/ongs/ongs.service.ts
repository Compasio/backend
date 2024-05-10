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

    const emailExists = await this.prisma.user.findFirst({
      where: {
        email
      }
    });
    const cnpjExists = await this.prisma.ong.findFirst({
      where: {
        cnpj_ong
      }
    });

    if(emailExists) throw new ConflictException("ERROR: Email já cadastrado");
    if(cnpjExists) throw new ConflictException("ERROR: CNPJ já cadastrado");
    
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createOngDto.password, salt);

    return this.prisma.user.create({
      data: {
        email: createOngDto.email,
        password: hash,
        userType: 'ong',
        ong: {
          create: 
            { 
              cpf_founder: createOngDto.cpf_founder,
              cnpj_ong: createOngDto.cnpj_ong,
              ong_name: createOngDto.ong_name,
              profile_picture: createOngDto.profile_picture,
              description: createOngDto.description,
              themes: createOngDto.themes,
            },
        },
      },
      include: {
        ong: true,
      },
    })
  }


  async getAllOngs(page: number) {
    if(page == 0) {
      const res = await this.prisma.user.findMany({where: {userType: 'ong'}, include: {ong: true}});
      res.forEach(e => delete e.password);
      res.forEach(e => delete e.ong.id_ong);
      return res;
    } else if(page == 1) {
      const res = await this.prisma.user.findMany({take: 20, where: {userType: 'ong'}, include: {ong: true}});
      res.forEach(e => delete e.password);
      res.forEach(e => delete e.ong.id_ong);
      return res;
    } else {
      const res = await this.prisma.user.findMany({take: 20, skip: (page - 1) * 20, where: {userType: 'ong'}, include: {ong: true}});
      res.forEach(e => delete e.password);
      res.forEach(e => delete e.ong.id_ong);
      return res;
    }
  }

  async getOngById(id: number) {
    const ong = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'ong'
      },
      include: {
        ong: true,
      }
    });

    if(!ong) throw new NotFoundException("ERROR: Ong não encontrada");
    delete ong.password;
    delete ong.ong.id_ong;
    return ong;
  }


  async getOngByName(name: string) {
    const ongNearest = await this.prisma.user.findMany({
      where: {
        ong: {
          OR: [
            {ong_name: { contains: name, mode: 'insensitive' }},
          ]
        }
      },
      include: {
        ong: true,
      }
    });

    if(!ongNearest) throw new NotFoundException('ERROR: Nenhuma ong com esse nome');
    ongNearest.forEach(e => {
      delete e.password;
      delete e.ong.id_ong;
    });
    
    return ongNearest;
  }

  async getOngsByTheme(themes: Themes_ONG[]) {
    const ongs = await this.prisma.user.findMany({
      where: {
        ong: {
          themes: {hasEvery: themes},
        } 
      },
      include: {
        ong: true,
      }
    });

    if(ongs[0] === undefined) throw new NotFoundException('ERROR: Nenhuma Ong com estes temas');
    ongs.forEach(e => {
      delete e.password;
      delete e.ong.id_ong;
    });
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
    const ong = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });

    if(!ong) throw new NotFoundException("ERROR: Ong não encontrada");

    const deleteFromUser = this.prisma.user.delete({
      where: {
        id,
      }
    });
    const deleteFromOng = this.prisma.ong.delete({
      where: {
        id_ong: id,
      }
    })

    await Promise.all([deleteFromUser, deleteFromOng]);

    return { success: true };
  }
}
