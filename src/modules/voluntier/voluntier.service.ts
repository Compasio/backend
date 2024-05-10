import { PrismaService } from '../../db/prisma.service';
import { CreateVoluntierDto } from './dto/create-voluntier.dto';
import { UpdateVoluntierDto } from './dto/update-voluntier.dto';
import { Habilities_User } from '@prisma/client';
import {
  ConflictException,
  Delete,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VoluntierService {
  constructor(private prisma: PrismaService) {}
  
  async createVoluntier(createVoluntierDto: CreateVoluntierDto) {
    const {email, cpf_voluntier} = createVoluntierDto;

    if(cpf_voluntier.length != 11) throw new ConflictException("ERROR: CPF inválido")
    
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    const cpfExists = await this.prisma.voluntier.findFirst({
      where: {
        cpf_voluntier,
      },
    });
    if(emailExists) throw new ConflictException("ERROR: Este email já está cadastrado em outra conta");
    if(cpfExists) throw new ConflictException("ERROR: Este CPF já está cadastrado em outra conta");

    //TODO --- CHECAR SE O CPF DO CARA REALMENTE EXISTE (PESQUISAR API PRA ISSO)

    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createVoluntierDto.password, salt);

    return this.prisma.user.create({
      data: {
        email: createVoluntierDto.email,
        password: hash,
        userType: 'voluntier',
        voluntier: {
          create: 
            { 
              cpf_voluntier: createVoluntierDto.cpf_voluntier,
              firstname: createVoluntierDto.firstname,
              lastname: createVoluntierDto.lastname,
              profile_picture: createVoluntierDto.profile_picture,
              description: createVoluntierDto.description,
              birthDate: createVoluntierDto.birthDate,
              habilities: createVoluntierDto.habilities,
            },
        },
      },
      include: {
        voluntier: true,
      },
    })
}


  async getAllVoluntiers(page: number) {
    if(page == 0) {
      const res = await this.prisma.user.findMany({where: {userType: 'voluntier'}, include: {voluntier: true}});
      res.forEach(e => {
        delete e.password;
        delete e.voluntier.id_voluntier;
      });
      return res;
    } else if(page == 1) {
      const res = await this.prisma.user.findMany({take: 20, where: {userType: 'voluntier'}, include: {voluntier: true}}, );
      res.forEach(e => {
        delete e.password;
        delete e.voluntier.id_voluntier;
      });
      return res;
    } else {
      const res = await this.prisma.user.findMany({take: 20, skip: (page - 1) * 20, where: {userType: 'voluntier'}, include: {voluntier: true}});
      res.forEach(e => {
        delete e.password;
        delete e.voluntier.id_voluntier;
      });
      return res;
    }
  }

  async getVoluntierById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'voluntier'
      },
      include: {
        voluntier: true,
      },
    });
    if(!user) throw new NotFoundException('ERROR: Voluntário não encontrado');
    delete user.password;
    delete user.voluntier.id_voluntier;
    return user;
  }


  //TODO --- MELHORAR ESTA FUNÇÃO PARA QUANDO APARECER O NOME COMPLETO DO CARA APARECER NA QUERY 
  async getVoluntiersByName(name: string) {
    const userNearest = await this.prisma.user.findMany({
      where: {
        voluntier: {
          OR: [
            { firstname: { contains: name, mode: 'insensitive' }},
            { lastname: { contains: name, mode: 'insensitive' }},
          ]
        }
      },
      include: {
        voluntier: true,
      }
    });

    if(!userNearest) throw new NotFoundException('ERROR: Nenhum usuário com esse nome');
    userNearest.forEach(e => {
      delete e.password;
      delete e.voluntier.id_voluntier;
    });

    return userNearest;
  }

  async getVoluntiersByHabilities(hability: Habilities_User[]) {
    const users = await this.prisma.user.findMany({
        where: {
          voluntier: {
              habilities: {hasEvery: hability},
          }
        },
        include: {
          voluntier: true,
        }
    });
    if(users[0] === undefined) throw new NotFoundException('ERROR: Nenhum usuário com estas habilidades');
    users.forEach(e => {
      delete e.password;
      delete e.voluntier.id_voluntier;
    });
    return users;
  }

  //TODO --- DEIXAR QUE APENAS ADMIN E PRÓPRIO USUÁRIO CONSIGAM DAR UPDATE NA CONTA
  async updateVoluntier(id: number, updateUserDto: UpdateVoluntierDto) {
    const user = await this.prisma.voluntier.findUnique({
      where: {
        id_voluntier: id,
      }
    })
    
    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');
    
    return this.prisma.voluntier.update({
      data: {
        ...updateUserDto
      },
      where: {
        id_voluntier: id,
      }
    });
  }

  //TODO --- DEIXAR QUE APENAS ADMIN E PRÓPRIO USUÁRIO CONSIGAM DELETAR A CONTA
  async removeVoluntier(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });

    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');

    const deleteFromUser = this.prisma.user.delete({
      where: {
        id,
      }
    });
    const deleteFromVoluntier = this.prisma.voluntier.delete({
      where: {
        id_voluntier: id,
      }
    })

    await Promise.all([deleteFromUser, deleteFromVoluntier]);

    return { success: true };
   }
}
