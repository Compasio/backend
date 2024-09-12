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
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { SearchThemeDto } from "./dto/search-theme.dto";

@Injectable()
export class OngsService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private cloudinary: CloudinaryService,
  ) {}

  async createOng(
    createOngDto: CreateOngDto,
    profilepic?: Express.Multer.File,
  ) {
    try {
      let { email, cpf_founder, cnpj_ong } = createOngDto;
      email = email.toLowerCase();

      if (process.env.CREATE_USER_WITHOUT_CPF_VERIFY == 'false') {
        const checkCpf = await this.authService.checkIfCpfIsValid(cpf_founder);
        if (!checkCpf) {
          return {"status": "error", "code": 409, "message": "Invalid CPF"};
        }
      }

      if (process.env.CHECK_ONG_WITHOUT_CNPJ_VERIFY == 'false') {
        const checkCnpj = await this.authService.checkIfCnpjIsValid(cnpj_ong);
        if (!checkCnpj) {
          return {"status": "error", "code": 409, "message": "Invalid CNPJ"};
        }
      }

      const cnpjExists = await this.prisma.ong.findFirst({
        where: {
          cnpj_ong,
        },
      });
      if (cnpjExists) return {"status": "error", "code": 409, "message": "Invalid CNPJ"};

      const emailExists = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (emailExists) return {"status": "error", "code": 409, "message": "Invalid email"};

      const salt = await bcrypt.genSalt();
      const hash: string = await bcrypt.hash(createOngDto.password, salt);
      createOngDto.password = hash;

      if (process.env.CREATE_USER_WITHOUT_EMAIL_VERIFY == 'false') {
        const makeVerifyCode =
          await this.authService.generateAndSendEmailVerifyCode(
            createOngDto,
            profilepic,
          );
        if (makeVerifyCode) {
          return {"status": "success", "message": "Code sent by email"};
        } else {
          throw new Error('makeVerifyCode');
        }
      } else {
        let createOng = await this.prisma.user.create({
          data: {
            email: createOngDto.email.toLowerCase(),
            password: hash,
            userType: 'ong',
            ong: {
              create: {
                cpf_founder: createOngDto.cpf_founder,
                cnpj_ong: createOngDto.cnpj_ong,
                ong_name: createOngDto.ong_name,
                description: createOngDto.description,
                themes: createOngDto.themes,
              },
            },
          },
          include: {
            ong: true,
          },
        });
        if (profilepic) {
          let uploadProfilePic =
            await this.cloudinary.uploadFileToCloudinary(profilepic);
          let registerPic = await this.cloudinary.registerPicInDb(
            uploadProfilePic.url,
            createOng.id,
            'profile',
            uploadProfilePic.public_id,
          );
        }

        return {"status": "success", "message": "Ong created"};
      }
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getAllOngs(page: number) {
    try {
      let res;
      let totalCount = await this.prisma.user.count({where: {userType: 'ong'}});

      if (page == 0) {
        res = await this.prisma.user.findMany({
          where: {
            userType: 'ong',
          },
          include: {
            ong: true,
            ImageResource: {
              where: {
                type: 'profile',
              },
            },
          },
        });
      } else if (page == 1) {
        res = await this.prisma.user.findMany({
          take: 8,
          where: {
            userType: 'ong',
          },
          include: {
            ong: true,
            ImageResource: {
              where: {
                type: 'profile',
              },
            },
          },
        });
      } else {
        res = await this.prisma.user.findMany({
          take: 8,
          skip: (page - 1) * 8,
          where: {
            userType: 'ong',
          },
          include: {
            ong: true,
            ImageResource: {
              where: {
                type: 'profile',
              },
            },
          },
        });
      }

      res.forEach((e) => delete e.password);
      res.forEach((e) => delete e.ong.id_ong);
      return {"status": "success", "data": res, "totalCount": totalCount};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getOngById(id: number) {
    try {
      const ong = await this.prisma.user.findUnique({
        where: {
          id,
          userType: 'ong',
        },
        include: {
          ong: true,
          ImageResource: {
            where: {
              type: 'profile',
            },
          },
        },
      });

      if (!ong) return {"status": "failure", "code": 404, "message": "Ong not found"};
      delete ong.password;
      delete ong.ong.id_ong;
      return {"status": "success", "data": ong};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getOngByName(name: string) {
    try {
      const ongNearest = await this.prisma.user.findMany({
        where: {
          ong: {
            OR: [{ ong_name: { contains: name, mode: 'insensitive' } }],
          },
        },
        include: {
          ong: true,
          ImageResource: {
            where: {
              type: 'profile',
            },
          },
        },
      });

      if (ongNearest[0] === undefined) return { 'status': 'failure', 'code': 404, 'message': 'Ong not found' };

      ongNearest.forEach((e) => {
        delete e.password;
        delete e.ong.id_ong;
      });

      return {"status": "success", "data": ongNearest};
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getOngsByTheme(dto: SearchThemeDto) {
    try {
      const { themes, page } = dto;
      let res;
      let count = await this.prisma.user.count({
        where: { ong: { themes: { hasEvery: themes } } },
      });

      if (page == 0) {
        res = await this.prisma.user.findMany({
          where: {
            ong: {
              themes: { hasEvery: themes },
            },
          },
          include: {
            ong: true,
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
            ong: {
              themes: { hasEvery: themes },
            },
          },
          include: {
            ong: true,
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
            ong: {
              themes: { hasEvery: themes },
            },
          },
          include: {
            ong: true,
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

      if (res[0] === undefined) return { 'status': 'failure', 'code': 404, 'message': 'Ong not found' };

      res.forEach((e) => {
        delete e.password;
        delete e.ong.id_ong;
      });
      return { "status": "success", "data": res, "totalCount": count };
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async updateOng(id: number, updateOngDto: UpdateOngDto, profilepic?: Express.Multer.File) {
    try {
      const ong = await this.prisma.ong.findUnique({
        where: {
          id_ong: id,
        },
      });

        if (!ong) return { 'status': 'failure', 'code': 404, 'message': 'Ong not found' };

      if(profilepic) {
        const oldPic = await this.prisma.imageResouce.deleteMany({
          where: {
            user: ong.id_ong,
            type: "profile",
          },
        });
        let uploadProfilePic =
          await this.cloudinary.uploadFileToCloudinary(profilepic);
        let registerPic = await this.cloudinary.registerPicInDb(
          uploadProfilePic.url,
          ong.id_ong,
          'profile',
          uploadProfilePic.public_id,
        );
      }

      let update = await this.prisma.ong.update({
        data: {
          ...updateOngDto,
        },
        where: {
          id_ong: id,
        },
      });

      return { "status": "success", "message": `Ong ${id} updated with success` };
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async removeOng(id: number) {
    try {
      const ong = await this.prisma.user.findUnique({
        where: {
          id,
          userType: 'ong',
        },
      });

      if (!ong) return { 'status': 'failure', 'code': 404, 'message': 'Ong not found' };

      const deleteFromUser = await this.prisma.user.delete({
        where: {
          id,
        },
      });

      return { "status": "success", "message": `Ong ${id} deleted with success` };
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async postPicture(ong: number, files: Express.Multer.File[]) {
    try {
      for (let file of files) {
        let uploadProfilePic = await this.cloudinary.uploadFileToCloudinary(file);
        let registerPic = await this.cloudinary.registerPicInDb(
          uploadProfilePic.url,
          ong,
          'galery',
          uploadProfilePic.public_id,
        );
      }
      return { "status": "success", "message": "Pictures posted" };
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }

  async getPictures(ong: number) {
    try {
      const getPics = await this.prisma.imageResouce.findMany({
        where: {
          user: ong,
          type: 'galery',
        },
      });
      return {"status": "success", "pictures": getPics}
    }
    catch (e) {
      return {"status": "failure", "code": 500, "message": e};
    }
  }
}
