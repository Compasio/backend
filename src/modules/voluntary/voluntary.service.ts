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
    try {
      let { email, cpf_voluntary } = createVoluntaryDto;
      email = email.toLowerCase();

      if (process.env.CREATE_USER_WITHOUT_CPF_VERIFY == 'false') {
        const checkCpf = await this.authService.checkIfCpfIsValid(cpf_voluntary);
        if (!checkCpf) {
          return {"status": "error", "code": 409, "message": "Invalid CPF"};
        }
      }

      const cpfExists = await this.prisma.voluntary.findFirst({
        where: {
          cpf_voluntary,
        },
      });
      if (cpfExists) return {"status": "error", "code": 409, "message": "Invalid CPF"};

      const emailExists = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (emailExists) return {"status": "error", "code": 409, "message": "Invalid email"};


      const salt = await bcrypt.genSalt();
      const hash: string = await bcrypt.hash(createVoluntaryDto.password, salt);
      createVoluntaryDto.password = hash;

      if (process.env.CREATE_USER_WITHOUT_EMAIL_VERIFY == 'false') {
        const makeVerifyCode = await this.authService.generateAndSendEmailVerifyCode(createVoluntaryDto, profilepic);
        if (makeVerifyCode) {
          return {"status": "success", "message": "Code sent by email"};
        } else {
          throw new Error('makeVerifyCode');
        }
      } else {
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
        if (profilepic) {
          let uploadProfilePic = await this.cloudinary.uploadFileToCloudinary(profilepic);
          let registerPic = await this.cloudinary.registerPicInDb(uploadProfilePic.url, createdUser.id, 'profile', uploadProfilePic.public_id);
        }
        return {"status": "success", "message": "Voluntary created"};
      }
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getAllVoluntarys(page: number) {
    try {
      let res;
      let count = await this.prisma.user.count({ where: { userType: 'voluntary' } });

      if (page == 0) {
        res = await this.prisma.user.findMany({
            where: {
              userType: 'voluntary',
            },
            include: {
              voluntary: true,
              ImageResource: {
                where: {
                  type: 'profile',
                },
              },
            },
          },
        );
      } else if (page == 1) {
        res = await this.prisma.user.findMany({
            take: 8,
            where: {
              userType: 'voluntary',
            },
            include: {
              voluntary: true,
              ImageResource: {
                where: {
                  type: 'profile',
                },
              },
            },
          },
        );
      } else {
        res = await this.prisma.user.findMany({
            take: 8,
            skip: (page - 1) * 8,
            where: {
              userType: 'voluntary',
            },
            include: {
              voluntary: true,
              ImageResource: {
                where: {
                  type: 'profile',
                },
              },
            },
          },
        );
      }

      res.forEach(e => {
        delete e.password;
        delete e.voluntary.id_voluntary;
      });

      return { 'status': 'success', 'data': res, 'totalCount': count };
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getVoluntaryById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
          userType: 'voluntary',
        },
        include: {
          voluntary: {
            include: { voluntaryRelations: true },
          },
          ImageResource: {
            where: {
              type: 'profile',
            },
          },
        },
      });
      if (!user) return {"status": "failure", "code": 404, "message": "Voluntary not found"};
      delete user.password;
      delete user.voluntary.id_voluntary;
      return {"status": "success", "data": user};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getVoluntarysByName(name: string) {
    try {
      const userNearest = await this.prisma.user.findMany({
        where: {
          voluntary: {
            OR: [
              { fullname: { contains: name, mode: 'insensitive' } },
            ],
          },
        },
        include: {
          voluntary: true,
          ImageResource: {
            where: {
              type: 'profile',
            },
          },
        },
      });

      if (!userNearest) return {"status": "failure", "code": 404, "message": "Voluntary not found"};
      userNearest.forEach(e => {
        delete e.password;
        delete e.voluntary.id_voluntary;
      });

      return {"status": "success", "data": userNearest};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getVoluntarysByHabilities(dto: SearchHabilityDto) {
    try {
      const { hability, page } = dto;
      let res;
      let count = await this.prisma.user.count({ where: { voluntary: { habilities: { hasEvery: hability } } } });

      if (page == 0) {
        res = await this.prisma.user.findMany({
          where: {
            voluntary: {
              habilities: { hasEvery: hability },
            },
          },
          include: {
            voluntary: true,
            ImageResource: {
              where: {
                type: 'profile',
              },
            },
          },
        });
      } else if (page == 1) {
        res = await this.prisma.user.findMany({
          where: {
            voluntary: {
              habilities: { hasEvery: hability },
            },
          },
          include: {
            voluntary: true,
            ImageResource: {
              where: {
                type: 'profile',
              },
            },
          },
          take: 8,
        });
      } else {
        res = await this.prisma.user.findMany({
          where: {
            voluntary: {
              habilities: { hasEvery: hability },
            },
          },
          include: {
            voluntary: true,
            ImageResource: {
              where: {
                type: 'profile',
              },
            },
          },
          take: 8,
          skip: (page - 1) * 8,
        });
      }

      if (res[0] === undefined)return {"status": "failure", "code": 404, "message": "Voluntary not found"};
      res.forEach(e => {
        delete e.password;
        delete e.voluntary.id_voluntary;
      });
      return { "status": "success", "data": res, "totalCount": count };
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async updateVoluntary(id: number, updateUserDto: UpdateVoluntaryDto) {
    try {
      const user = await this.prisma.voluntary.findUnique({
        where: {
          id_voluntary: id,
        },
      });

      if (!user) return {"status": "failure", "code": 404, "message": "Voluntary not found"};

      let update = await this.prisma.voluntary.update({
        data: {
          ...updateUserDto,
        },
        where: {
          id_voluntary: id,
        },
      });

      return {"status": "success", "message": `Voluntary ${id} updated successfully.`};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async removeVoluntary(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) return {"status": "failure", "code": 404, "message": "Voluntary not found"};

      const deleteFromUser = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return {"status": "success", "message": `Voluntary ${id} deleted successfully.`};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
   }
}
