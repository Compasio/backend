import { PrismaService } from '../../db/prisma.service';
import { CreateVoluntaryDto } from './dto/create-voluntary.dto';
import { UpdateVoluntaryDto } from './dto/update-voluntary.dto';
import { AuthService } from '../../auth/auth.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { SearchHabilityDto } from "./dto/search-hability.dto";

@Injectable()
export class VoluntaryService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private cloudinary: CloudinaryService,
  ) {}
  
  async createVoluntary(createVoluntaryDto: CreateVoluntaryDto, profilepic?: Express.Multer.File) {
    let {email, cpf_voluntary} = createVoluntaryDto;
    email = email.toLowerCase();

    if(process.env.CREATE_USER_WITHOUT_CPF_VERIFY == "false") {
      const checkCpf = await this.authService.checkIfCpfIsValid(cpf_voluntary);
      if(!checkCpf) {
        throw new ConflictException("ERROR: CPF inválido");
      }
    }

    const cpfExists = await this.prisma.voluntary.findFirst({
      where: {
        cpf_voluntary,
      },
    });
    if(cpfExists) throw new ConflictException("ERROR: CPF inválido");
    
    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if(emailExists) throw new ConflictException("ERROR: Email inválido");


    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(createVoluntaryDto.password, salt);
    createVoluntaryDto.password = hash;

    if(process.env.CREATE_USER_WITHOUT_EMAIL_VERIFY == "false") {
      const makeVerifyCode = await this.authService.generateAndSendEmailVerifyCode(createVoluntaryDto, profilepic);
      if(makeVerifyCode) {
        return true;
      } else {
        throw new Error("Ocorreu um erro, por favor tente novamente");
      }
    }
    else {
      let createdUser = await this.prisma.user.create({
        data: {
          email: createVoluntaryDto.email.toLowerCase(),
          password: createVoluntaryDto.password,
          userType: 'voluntary',
          voluntary: {
            create: 
              { 
                cpf_voluntary: createVoluntaryDto.cpf_voluntary,
                fullname: createVoluntaryDto.fullname,
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
      if(profilepic) {
        let uploadProfilePic = await this.cloudinary.uploadFileToCloudinary(profilepic);
        let registerPic = await this.cloudinary.registerPicInDb(uploadProfilePic.url, createdUser.id, "profile", uploadProfilePic.public_id);
      }
      return createdUser;
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
          voluntary: true,
          ImageResource: {
            where: {
              type: "profile"
            }
          },
        }},
      );
    } 
    
    else if(page == 1) {
      res = await this.prisma.user.findMany({
        take: 8,
        where: {
          userType: 'voluntary'
        },
        include: {
          voluntary: true,
          ImageResource: {
            where: {
              type: "profile"
            }
          },
        },
        },
      );
    } 
    
    else {
      res = await this.prisma.user.findMany({
        take: 8,
        skip: (page - 1) * 8,
        where: {
          userType: 'voluntary'
        },
        include: {
          voluntary: true,
          ImageResource: {
            where: {
              type: "profile"
            }
          },
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
        voluntary: {
          include: {voluntaryRelations: true}
        },
        ImageResource: {
          where: {
            type: "profile"
          }
        },
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
        ImageResource: {
          where: {
            type: "profile"
          }
        },
      }
    });

    if(!userNearest) throw new NotFoundException('ERROR: Nenhum usuário com esse nome');
    userNearest.forEach(e => {
      delete e.password;
      delete e.voluntary.id_voluntary;
    });

    return userNearest;
  }

  async getVoluntarysByHabilities(dto: SearchHabilityDto) {
    const {hability, page} = dto;
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
          ImageResource: {
            where: {
              type: "profile"
            }
          },
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
          ImageResource: {
            where: {
              type: "profile"
            }
          },
        },
        take: 8,
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
          ImageResource: {
            where: {
              type: "profile"
            }
          },
        },
        take: 8,
        skip: (page - 1) * 8,
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

    const deleteFromUser = await this.prisma.user.delete({
      where: {
        id,
      }
    });

    return { success: true };
   }
}
