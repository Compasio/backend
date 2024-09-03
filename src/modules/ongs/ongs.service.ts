import { CreateOngDto } from './dto/create-ong.dto';
import { UpdateOngDto } from './dto/update-ong.dto';
import { PrismaService } from '../../db/prisma.service';
import { AuthService } from '../../auth/auth.service';
import {
  ConflictException,
  Injectable, Logger,
  NotFoundException
} from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Themes_ONG } from '@prisma/client';

@Injectable()
export class OngsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async createOng(createOngDto: CreateOngDto) {
    let {email, cpf_founder, cnpj_ong} = createOngDto;
    email = email.toLowerCase();

    if(process.env.CREATE_USER_WITHOUT_CPF_VERIFY == "false") {
      const checkCpf = await this.authService.checkIfCpfIsValid(cpf_founder);
      if(!checkCpf) {
        throw new ConflictException("ERROR: CPF inválido");
      }
    }


    if(process.env.CHECK_ONG_WITHOUT_CNPJ_VERIFY == "false") {
      const checkCnpj = await this.authService.checkIfCnpjIsValid(cnpj_ong);
      if(!checkCnpj) {
        throw new ConflictException("ERROR: CNPJ inválido");
      }
    }

    const cnpjExists = await this.prisma.ong.findFirst({
      where: {
        cnpj_ong
      }
    });
    if(cnpjExists) throw new ConflictException("ERROR: CNPJ inválido");

    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if(emailExists) throw new ConflictException("ERROR: Email inválido");
    
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createOngDto.password, salt);
    createOngDto.password = hash;

    if(process.env.CREATE_USER_WITHOUT_EMAIL_VERIFY == "false") {
      const makeVerifyCode = await this.authService.generateAndSendEmailVerifyCode(createOngDto);
      if(makeVerifyCode) {
        return true;
      } else {
        throw new Error("Ocorreu um erro, por favor tente novamente");
      }
    } 
    else {
      return this.prisma.user.create({
        data: {
          email: createOngDto.email.toLowerCase(),
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
  }


  async getAllOngs(page: number) {
    let res;
    if(page == 0) {
      res = await this.prisma.user.findMany({
        where: {
          userType: 'ong'
        },
        include: {
          ong: true,
        },
      });
    } 
    
    else if(page == 1) {
      res = await this.prisma.user.findMany({
        take: 20,
        where: {
          userType: 'ong',
        },
        include: {
          ong: true,
        }},
      );
    } 
    
    else {
      res = await this.prisma.user.findMany({
        take: 20,
        skip: (page - 1) * 20,
        where: {
          userType: 'ong',
        },
        include: {
          ong: true,
        }},
      );
    }

    res.forEach(e => delete e.password);
    res.forEach(e => delete e.ong.id_ong);
    return res;
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

  async getOngsByTheme(page: number, themes: Themes_ONG[]) {
    let res;
    let count = await this.prisma.user.count({where:{ong:{themes: {hasEvery: themes}}}});

    if(page == 0) {
      res = await this.prisma.user.findMany({
        where: {
          ong: {
            themes: {hasEvery: themes},
          } 
        },
        include: {
          ong: true,
        }
      });  
    }
    else if(page == 1) {
      res = await this.prisma.user.findMany({
        where: {
          ong: {
            themes: {hasEvery: themes},
          } 
        },
        include: {
          ong: true,
        },
        take: 20,
      });  
    }
    else {
      res = await this.prisma.user.findMany({
        where: {
          ong: {
            themes: {hasEvery: themes},
          } 
        },
        include: {
          ong: true,
        },
        take: 20,
        skip: (page - 1) * 20,
      });  
    }
    
    if(res[0] === undefined) throw new NotFoundException('ERROR: Nenhuma Ong com estes temas');
    res.forEach(e => {
      delete e.password;
      delete e.ong.id_ong;
    });
    return {"response": res, "totalCount": count};
  }

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

  async removeOng(id: number) {
    const ong = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'ong',
      },
    });

    if(!ong) throw new NotFoundException("ERROR: Ong não encontrada");

    const deleteFromOng = this.prisma.ong.delete({
      where: {
        id_ong: id,
      }
    });

    const deleteFromUser = this.prisma.user.delete({
      where: {
        id,
      }
    });

    await Promise.all([deleteFromOng, deleteFromUser]);

    return { success: true };
  }
}
