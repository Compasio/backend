import { PrismaService } from '../../db/prisma.service';
import { CreateVoluntaryDto } from './dto/create-voluntary.dto';
import { UpdateVoluntaryDto } from './dto/update-voluntary.dto';
import { Habilities_User } from '@prisma/client';
import { AuthService } from '../../auth/auth.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class VoluntaryService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}
  
  async createVoluntary(createVoluntaryDto: CreateVoluntaryDto) {
    const {email, cpf_voluntary} = createVoluntaryDto;

    if(cpf_voluntary.length != 11 || /^\d+$/.test(cpf_voluntary) == false) throw new ConflictException("ERROR: CPF inválido")
    
    
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    const cpfExists = await this.prisma.voluntary.findFirst({
      where: {
        cpf_voluntary,
      },
    });
    if(emailExists) throw new ConflictException("ERROR: Este email já está cadastrado em outra conta");
    if(cpfExists) throw new ConflictException("ERROR: Este CPF já está cadastrado em outra conta");

    //TODO --- CHECAR SE O CPF DO CARA REALMENTE EXISTE (PESQUISAR API PRA ISSO)

    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createVoluntaryDto.password, salt);
    createVoluntaryDto.password = hash;

    if(process.env.CREATE_USER_WITHOUT_EMAIL_VERIFY == "false") {
      const makeVerifyCode = await this.authService.generateAndSendEmailVerifyCode(createVoluntaryDto);
      if(makeVerifyCode) {
        return true;
      } else {
        throw new Error("Ocorreu um erro, por favor tente novamente");
      }
    }
    else {
      return this.prisma.user.create({
        data: {
          email: createVoluntaryDto.email,
          password: createVoluntaryDto.password,
          userType: 'voluntary',
          voluntary: {
            create: 
              { 
                cpf_voluntary: createVoluntaryDto.cpf_voluntary,
                fullname: createVoluntaryDto.fullname,
                profile_picture: createVoluntaryDto.profile_picture,
                description: createVoluntaryDto.description,
                birthDate: createVoluntaryDto.birthDate,
                habilities: createVoluntaryDto.habilities,
              },
          },
        },
        include: {
          voluntary: true,
        },
      });
    }
    
  }

  async getAllVoluntarys(page: number) {
    let res;
    let count = await this.prisma.user.count({where:{userType: 'voluntary'}});

    if(page == 0) {
      res = await this.prisma.user.findMany({
        where: {
          userType: 'voluntary'
        }, 
        include: {
          voluntary: {
            include: {   
              voluntaryRelations: true,
            }
          } 
        }},
      );
    } 
    
    else if(page == 1) {
      res = await this.prisma.user.findMany({
        take: 20,
        where: {
          userType: 'voluntary'
        },
        include: {
          voluntary: true
        }}, 
      );
    } 
    
    else {
      res = await this.prisma.user.findMany({
        take: 20,
        skip: (page - 1) * 20,
        where: {
          userType: 'voluntary'
        },
        include: {
          voluntary: true
        }},
      );
    }
    
    res.forEach(e => {
      delete e.password;
      delete e.voluntary.id_voluntary;
    });

    return {"response": res, "totalCount": count};
  }

  async getVoluntaryById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'voluntary'
      },
      include: {
        voluntary: true,
      },
    });
    if(!user) throw new NotFoundException('ERROR: Voluntário não encontrado');
    delete user.password;
    delete user.voluntary.id_voluntary;
    return user;
  }

  async getVoluntarysByName(name: string) {
    const userNearest = await this.prisma.user.findMany({
      where: {
        voluntary: {
          OR: [
            { fullname: { contains: name, mode: 'insensitive' }},
          ]
        }
      },
      include: {
        voluntary: true,
      }
    });

    if(!userNearest) throw new NotFoundException('ERROR: Nenhum usuário com esse nome');
    userNearest.forEach(e => {
      delete e.password;
      delete e.voluntary.id_voluntary;
    });

    return userNearest;
  }

  async getVoluntarysByHabilities(page: number, hability: Habilities_User[]) {
    console.log(page, typeof page)
    let res;
    let count = await this.prisma.user.count({where:{voluntary:{habilities: {hasEvery: hability}}}});

    if(page == 0) {
      res = await this.prisma.user.findMany({
        where: {
          voluntary: {
              habilities: {hasEvery: hability},
          }
        },
        include: {
          voluntary: true,
        }
      });
    }
    else if(page == 1) {
      res = await this.prisma.user.findMany({
        where: {
          voluntary: {
              habilities: {hasEvery: hability},
          }
        },
        include: {
          voluntary: true,
        },
        take: 20,
      });
    }
    else {
      res = await this.prisma.user.findMany({
        where: {
          voluntary: {
              habilities: {hasEvery: hability},
          }
        },
        include: {
          voluntary: true,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }
    
    if(res[0] === undefined) throw new NotFoundException('ERROR: Nenhum usuário com estas habilidades');
    res.forEach(e => {
      delete e.password;
      delete e.voluntary.id_voluntary;
    });
    return {"response": res, "totalCount": count};
  }

  async updateVoluntary(id: number, updateUserDto: UpdateVoluntaryDto) {
    const user = await this.prisma.voluntary.findUnique({
      where: {
        id_voluntary: id,
      }
    })
    
    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');
    
    return this.prisma.voluntary.update({
      data: {
        ...updateUserDto
      },
      where: {
        id_voluntary: id,
      }
    });
  }

  async removeVoluntary(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });

    if(!user) throw new NotFoundException('ERROR: Usuário não encontrado');

    const deleteFromVoluntary = this.prisma.voluntary.delete({
      where: {
        id_voluntary: id,
      }
    });

    const deleteFromUser = this.prisma.user.delete({
      where: {
        id,
      }
    });

    await Promise.all([deleteFromVoluntary, deleteFromUser]);

    return { success: true };
   }
}
