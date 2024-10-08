import { CreateOngAssociatedDto } from './dto/create-ong-associated.dto';
import { UpdateOngAssociatedDto } from './dto/update-ong-associated.dto';
import { PrismaService } from 'src/db/prisma.service';
import { Permissions } from '@prisma/client';
import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
  Request
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SearchPermissionsDto } from "./dto/search-permissions.dto";

@Injectable()
export class OngAssociatedService {
  constructor(private prisma: PrismaService) {}
  
  async createOngAssociate(createOngAssociatedDto: CreateOngAssociatedDto) {
    const { ongid, email } = createOngAssociatedDto;

    const ongExists = await this.prisma.user.findFirst({
      where: {
        id: ongid,
        userType: 'ong'
      },
    });
    if(!ongExists) throw new ConflictException("ERROR: Ong não existe");

    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if(emailExists) throw new ConflictException("ERROR: Email inválido");

    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createOngAssociatedDto.password, salt);

    return this.prisma.user.create({
      data: {
        email: createOngAssociatedDto.email.toLowerCase(),
        password: hash,
        userType: 'ongAssociated',
        ongAssociated: {
          create: {
            firstname: createOngAssociatedDto.firstname,
            lastname: createOngAssociatedDto.lastname,
            ong: ongid,
            permissions: createOngAssociatedDto.permissions,
          },
        },
      },
      include: {
        ongAssociated: true,
      },
    });
  }

  async getOngAssociatesByOng(page: number, ongid: number) {
    if(page == 0) {
      const res = await this.prisma.user.findMany({
        where: {
          userType: 'ongAssociated',
          ongAssociated: {ong: ongid},
        },
        include: {ongAssociated: true}
      });
      res.forEach(e => {
        delete e.password;
        delete e.ongAssociated.id_associate;
      });
      return res;
    } else if(page == 1) {
      const res = await this.prisma.user.findMany({
        take: 20,
        where: {
          userType: 'ongAssociated',
          ongAssociated: {ong: ongid},
        }, 
        include: {
          ongAssociated: true,
        },
      });
      res.forEach(e => {
        delete e.password;
        delete e.ongAssociated.id_associate;
      });
      return res;
    } else {
      const res = await this.prisma.user.findMany({
        take: 20,
        skip: (page - 1) * 20,
        where: {
          userType: 'ongAssociated',
          ongAssociated: {ong: ongid},
        },
        include: {ongAssociated: true},
      });
      res.forEach(e => {
        delete e.password;
        delete e.ongAssociated.id_associate;
      });
      return res;
    }
  }

  async getOngAssociateById(id: number) {
    const associate = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'ongAssociated',
      },
      include: {
        ongAssociated: true,
      },
    });
    if(!associate) throw new NotFoundException('ERROR: Voluntário não encontrado');
    delete associate.password;
    delete associate.ongAssociated.id_associate;
    return associate;
  }

  async getOngAssociatesByPermission(dto: SearchPermissionsDto) {
    const {permission, page, ongid} = dto;
    let res;
    let count = await this.prisma.user.count({where:{ongAssociated:{permissions: {hasEvery: permission}}}});
    
    if(page == 0) {
      res = await this.prisma.user.findMany({
        where: {
          ongAssociated: {
            ong: ongid,
            permissions: {hasEvery: permission},
          },
        },
        include: {
          ongAssociated: true,
        },
      });
    }
    else if(page == 1) {
      res = await this.prisma.user.findMany({
        where: {
          ongAssociated: {
            ong: ongid,
            permissions: {hasEvery: permission},
          },
        },
        include: {
          ongAssociated: true,
        },
        take: 20,
      });
    }
    else {
      res = await this.prisma.user.findMany({
        where: {
          ongAssociated: {
            ong: ongid,
            permissions: {hasEvery: permission},
          },
        },
        include: {
          ongAssociated: true,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
    
    if(res[0] === undefined) throw new NotFoundException('ERROR: Nenhum associado com estas permissões');
    res.forEach(e => {
      delete e.password;
      delete e.ongAssociated.id_associate;
    });
    return res;
  }

  async updateOngAssociate(id: number, ongid: number, updateOngAssociatedDto: UpdateOngAssociatedDto) {
    const associate = await this.prisma.ongAssociated.findUnique({
      where: {
        id_associate: id,
        ong: ongid,
      },
    });

    if(!associate) throw new NotFoundException("ERROR: Associado não encontrado");

    return this.prisma.ongAssociated.update({
      data: {
        ...updateOngAssociatedDto
      },
      where: {
        id_associate: id,
      },
    });
  }

  async removeOngAssociate(id: number, ongid: number) {
    const associate = await this.prisma.user.findUnique({
      where: {
        id,
        ongAssociated: {ong: ongid}
      }, 
    });

    if(!associate) throw new NotFoundException('ERROR: Usuário não encontrado');

    const deleteFromUser = await this.prisma.user.delete({
      where: {
        id,
      }
    });

    return { success: true };
  }
}
