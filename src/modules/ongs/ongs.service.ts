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
    let { email, cpf_founder, cnpj_ong } = createOngDto;
    email = email.toLowerCase();

    if (process.env.CREATE_USER_WITHOUT_CPF_VERIFY == 'false') {
      const checkCpf = await this.authService.checkIfCpfIsValid(cpf_founder);
      if (!checkCpf) {
        throw new ConflictException('ERROR: CPF inválido');
      }
    }

    if (process.env.CHECK_ONG_WITHOUT_CNPJ_VERIFY == 'false') {
      const checkCnpj = await this.authService.checkIfCnpjIsValid(cnpj_ong);
      if (!checkCnpj) {
        throw new ConflictException('ERROR: CNPJ inválido');
      }
    }

    const cnpjExists = await this.prisma.ong.findFirst({
      where: {
        cnpj_ong,
      },
    });
    if (cnpjExists) throw new ConflictException('ERROR: CNPJ inválido');

    const emailExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (emailExists) throw new ConflictException('ERROR: Email inválido');

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
        return true;
      } else {
        throw new Error('Ocorreu um erro, por favor tente novamente');
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

      return createOng;
    }
  }

  async getAllOngs(page: number) {
    let res;
    if (page == 0) {
      res = await this.prisma.user.findMany({
        where: {
          userType: 'ong',
        },
        include: {
          ong: true,
          ImageResource: {
            where: {
              type: "profile"
            }
          }
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
              type: "profile",
            },
          },
        }
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
              type: "profile",
            },
          }
        },
      });
    }

    res.forEach((e) => delete e.password);
    res.forEach((e) => delete e.ong.id_ong);
    return res;
  }

  async getOngById(id: number) {
    const ong = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'ong',
      },
      include: {
        ong: true,
        ImageResource: {
          where: {
            type: "profile"
          }
        }
      },
    });

    if (!ong) throw new NotFoundException('ERROR: Ong não encontrada');
    delete ong.password;
    delete ong.ong.id_ong;
    return ong;
  }

  async getOngByName(name: string) {
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
            type: "profile"
          }
        }
      },
    });

    if (!ongNearest) throw new NotFoundException('ERROR: Nenhuma ong com esse nome');

    ongNearest.forEach((e) => {
      delete e.password;
      delete e.ong.id_ong;
    });

    return ongNearest;
  }

  async getOngsByTheme(dto: SearchThemeDto) {
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
              type: "profile"
            }
          }
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
              type: "profile"
            }
          }
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
              type: "profile"
            }
          }
        },
        take: 8,
        skip: (page - 1) * 8,
      });
    }

    if (res[0] === undefined) throw new NotFoundException('ERROR: Nenhuma Ong com estes temas');

    res.forEach((e) => {
      delete e.password;
      delete e.ong.id_ong;
    });
    return { response: res, totalCount: count };
  }

  async updateOng(id: number, updateOngDto: UpdateOngDto, profilepic?: Express.Multer.File) {
    const ong = await this.prisma.ong.findUnique({
      where: {
        id_ong: id,
      },
    });

    if (!ong) throw new NotFoundException('ERROR: Ong não encontrada');

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

    return this.prisma.ong.update({
      data: {
        ...updateOngDto,
      },
      where: {
        id_ong: id,
      },
    });
  }

  async removeOng(id: number) {
    const ong = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'ong',
      },
    });

    if (!ong) throw new NotFoundException('ERROR: Ong não encontrada');

    const deleteFromUser = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    return { success: true };
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
      return true;
    } catch (e) {
      throw new Error("Algo deu errado");
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
      return {"pictures": getPics}
    } catch (e) {
      console.log(e);
      throw new Error("Algo deu errado");
    }
  }

  async deletePictures(id: number, ong: number) {
      const pictures = await this.prisma.imageResouce.findFirst({
        where: {
          id,
          user: ong,
        },
      });

      if (!pictures) throw new NotFoundException("Erro: foto não encontrada");

      let delFromCloudinray = await this.cloudinary.deletePic([pictures.cloudName]);
      let delFromDb = await this.prisma.imageResouce.delete({
        where: {
          id,
        },
      });

      return true;
  }
}
