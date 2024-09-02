import {
  ConflictException,
  Injectable, Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/db/prisma.service';
import { Permissions } from '@prisma/client';
import { LogUserDto } from './dto/log.user.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import { CodeDto } from './dto/code-dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { PassCodeDto } from "./dto/pass-code-dto";
import { EmailDto } from "./dto/emai-dto";

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
      private prisma: PrismaService,
      private readonly httpService: HttpService,
    ) {}
  private readonly logger = new Logger(AuthService.name);
  
    async signIn(email: string, password: string) {
      const user = await this.getUserByEmail(email);
      if(!user) throw new UnauthorizedException('Usuário não existe');
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (isMatch) {
        const payload = { id: user.id, email: user.email, userType: user.userType };
        return await this.jwtService.signAsync(payload);
      } else {
        throw new UnauthorizedException('Senha incorreta');
      }
    }

    async singOut(bearer: string) {
      let token = bearer.split(' ')[1];
      const addTokenToBlackList = await this.prisma.tokenBlackList.create({
        data: {
          token,
        },
      });
      if(addTokenToBlackList) return true;
    }

    async getUserByEmail(email: string) {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if(!user) throw new NotFoundException('ERROR: Voluntário não encontrado');
      return user;
  }

  async getProfile(req) {
    const user = {id: req.user.id,};
    const account = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        voluntary: true,
        ong: true,
        ongAssociated: true,
      }
    });

    if(account.voluntary == null) delete account.voluntary;
    if(account.ong == null) delete account.ong;
    if(account.ongAssociated == null) delete account.ongAssociated;
    delete account.password;

    return account;
}

  async checkIdAndAdminStatus(userid: number, req) {
    const userRequest = {id: req.user.id, userType: req.user.userType};
    if(userRequest.userType === 'admin') {
      return true;
    } else if(userid === userRequest.id) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  async checkIfOngAssociateIsFromOngAndItsPermission(ong: number, req, permissions: Permissions) {
    let id = req.user.id;
    const associate = await this.prisma.ongAssociated.findUnique({
      where: {
        id_associate: id,
        ong,
      },
    });

    if(!associate) throw new UnauthorizedException();

    let associatePermissions = associate.permissions;
    if(associatePermissions.includes(permissions) == false) throw new UnauthorizedException("ERROR: você não tem permissão para executar esta ação");
    
    return true;
  }

  async checkProjectOwner(req, project: number) {
      let id = req.user.id;
      let userType = req.user.userType;
      if(userType == 'admin') {
        return true;
      }

      const projectData = await this.prisma.project.findUnique({
        where: {
          id_project: project,
        },
      });

      if(userType == 'ong') {
        if(id != projectData.ong) throw new UnauthorizedException();
      }
      else {
        let check = this.checkIfOngAssociateIsFromOngAndItsPermission(projectData.ong, req, 'projects');
      }

      return true;
  }

  async checkProjectOwnershipForCrowdfunding(req, id: number = null, project: number = null) {
    let proj: number;
    let userType = req.user.userType;
    if(userType == 'admin') {
      return true;
    }

    if(project != null) {
      proj = project;
    }
    else if (id != null) {
      const checkCrowd = await this.prisma.crowdFunding.findUnique({
        where: {
          id_crowdfunding: id,
        },
      });

      if(!checkCrowd) throw new NotFoundException('vaquinha não encontrada');

      proj = checkCrowd.project;
    }
    else {
      throw new UnauthorizedException();
    }

    const checkOwnership = await this.prisma.project.findUnique({
      where: {
        id_project: proj,
      },
    });
  
    if(!checkOwnership) throw new NotFoundException('projeto não encontrado');

    let requester = req.user.id;
    let ong = checkOwnership.ong;

    if(userType == 'ong') {
      if(ong != requester) throw new UnauthorizedException("ERROR: você não tem permissão para executar esta ação");
    }
    else {
      let check = this.checkIfOngAssociateIsFromOngAndItsPermission(ong, req, 'projects');
    }

    return true;    
  }

  async passwordRecoveryCode(dto: EmailDto) {
      try {
        const {email} = dto;

        const checkRequests = await this.prisma.passwordRecCode.findMany({
          where: {
            userEmail: email,
          },
        });

        if(checkRequests.length >= 5) return {"erro": "Muitos requests, por favor tente novamente mais tarde"};

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const createTheCode = await this.prisma.passwordRecCode.create({
          data: {
            code,
            userEmail: email,
            createdAt: Date.now()
          }
        });

        const sendMail = await this.emailSender(
          email,
          "Recuperação de Senha Compassio",
          `<p>Olá, você está recebendo este email para recuperar sua conta Compassio!</p><br /><p>${code}</p>`
        )

        return true;
      }
      catch(e) {
        console.log(e)
        throw new Error("Erro ao gerar código, por favor tente novamente");
      }
  }

  async resetPassword(codeDto: PassCodeDto) {
      try {
        const { code, password } = codeDto;

        const data = await this.prisma.passwordRecCode.findUnique({
          where: {
            code,
          },
        });

        if(!data) return false;

        const { userEmail } = data;
        const salt = await bcrypt.genSalt();
        const hash: string = await bcrypt.hash(password, salt);

        const update = await this.prisma.user.update({
          data: {
            password: hash,
          },
          where: {
            email: userEmail,
          },
        });

        const removeCode = await this.prisma.passwordRecCode.delete({where: {code}});

        return true;
      }
      catch(e) {
        throw new ConflictException(e);
      }
  }

  async generateAndSendEmailVerifyCode(dto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {

      const secret = process.env.SECRETKEY;
      if(secret.length !== 32) throw new Error("SecretKey invalida");
      const key = Buffer.from(secret, 'hex');
      const iv = crypto.randomBytes(16);
      let cDto = crypto.createCipheriv('aes-128-cbc', key, iv);
      let dto2 = JSON.stringify(dto)
      let cryptDto = cDto.update(dto2, 'utf8', 'hex')
      cryptDto += cDto.final('hex');

      const createThisCode = await this.prisma.emailVerifyCode.create({
        data: {
          code,
          dto: cryptDto,
          iv,
          createdAt: Date.now(),
        },
      });

      const sendMail = this.emailSender(dto.email,
        "Verificação de Email da Compassio",
        `<p>Olá, você está recebendo este email para criar sua conta Compassio!</p><br /><p>${code}</p>`
      )

      return true;
    }
    catch(e) {
      console.log(e)
      return false;
    }
  }

  async verifyUserCreation(codeDto: CodeDto) {
    const { code } = codeDto;

    if(code.length !== 6 || /^\d+$/.test(code) == false) throw new ConflictException("Codigo Inválido");
    const verify = await this.prisma.emailVerifyCode.findUnique({
      where: {
        code,
      },
    });
    if(!verify) throw new ConflictException("Código inválido");

    let dtoJson;
    try {
      const secret = process.env.SECRETKEY;
      if(secret.length !== 32) throw new Error("SecretKey invalida");
      const key = Buffer.from(secret, 'hex');
      const decipher = crypto.createDecipheriv('aes-128-cbc', key, verify.iv);
      dtoJson = decipher.update(verify.dto, 'hex', 'utf8');
      dtoJson += decipher.final('utf8');
      dtoJson = JSON.parse(dtoJson);
    } catch(e) {
      console.log(e)
      throw new Error("Ouve um erro, por favor tente novamente");
    }

    const removeCode = await this.prisma.emailVerifyCode.delete({where: {code}});

    if(dtoJson.cpf_voluntary) {
      return this.prisma.user.create({
        data: {
          email: dtoJson.email,
          password: dtoJson.password,
          userType: 'voluntary',
          voluntary: {
            create:
              {
                cpf_voluntary: dtoJson.cpf_voluntary,
                fullname: dtoJson.fullname,
                profile_picture: dtoJson.profile_picture,
                description: dtoJson.description,
                birthDate: dtoJson.birthDate,
                habilities: dtoJson.habilities,
              },
          },
        },
        include: {
          voluntary: true,
        },
      });
    }

    else {
      return this.prisma.user.create({
        data: {
          email: dtoJson.email,
          password: dtoJson.password,
          userType: 'ong',
          ong: {
            create:
              {
                cpf_founder: dtoJson.cpf_founder,
                cnpj_ong: dtoJson.cnpj_ong,
                ong_name: dtoJson.ong_name,
                profile_picture: dtoJson.profile_picture,
                description: dtoJson.description,
                themes: dtoJson.themes,
              },
          },
        },
        include: {
          ong: true,
        },
      });
    }
  }

  private async emailSender(email: string, subject: string, html: string) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASS,
          }
        });

        const mail = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          html: html
        };

        transporter.sendMail(mail, function(e, info) {
          if(e) {
            console.log(e)
            return false;
          } else {
            return info;
          }
        });
      }
      catch(e) {
        return e;
      }
    }

    async checkIfCpfIsValid(cpf: string) {
      if(cpf.length != 11 || /^\d+$/.test(cpf) == false) return false;

      let calc: number = (
        (parseInt(cpf[0])*10) + (parseInt(cpf[1])*9) +
        (parseInt(cpf[2])*8) + (parseInt(cpf[3])*7) +
        (parseInt(cpf[4])*6) + (parseInt(cpf[5])*5) +
        (parseInt(cpf[6])*4) + (parseInt(cpf[7])*3) +
        (parseInt(cpf[8])*2)
      ) % 11;
      let firstDigit: number = 11 - calc;
      if(firstDigit >= 10) firstDigit = 0;
      if(parseInt(cpf[9]) != firstDigit) return false;

      let calc2: number = (
        (parseInt(cpf[0])*11) + (parseInt(cpf[1])*10) +
        (parseInt(cpf[2])*9) + (parseInt(cpf[3])*8) +
        (parseInt(cpf[4])*7) + (parseInt(cpf[5])*6) +
        (parseInt(cpf[6])*5) + (parseInt(cpf[7])*4) +
        (parseInt(cpf[8])*3) + (parseInt(cpf[9])*2)
      ) % 11;
      let secondDigit: number = 11 - calc2;
      if(secondDigit >= 10) secondDigit = 0;
      if(parseInt(cpf[10]) != secondDigit) return false;
      return true;
    }

    async checkIfCnpjIsValid(cnpj: string) {
      if(cnpj.length != 14) return false;

      if(process.env.USE_API_FOR_CNPJ_VERIFY == "true") {
        try {
          let url = `https://api.cnpja.com/office/${cnpj}?simples=true`
          const { data } = await firstValueFrom(
            this.httpService.get(url, {headers: { Authorization: `${process.env.CNPJ}`} }).pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw error;
              }),
            ),
          );
          return true;
        } catch (e) {
          return false;
        }
      }
      else {
        let calc1: number = (
          (parseInt(cnpj[11])*2) + (parseInt(cnpj[10])*3) +
          (parseInt(cnpj[9])*4) + (parseInt(cnpj[8])*5) +
          (parseInt(cnpj[7])*6) + (parseInt(cnpj[6])*7) +
          (parseInt(cnpj[5])*8) + (parseInt(cnpj[4])*9) +
          (parseInt(cnpj[3])*2) + (parseInt(cnpj[2])*3) +
          (parseInt(cnpj[1])*4) + (parseInt(cnpj[0])*5)
        ) % 11;
        let firstDigit: number = 11 - calc1;
        if(firstDigit >= 10) firstDigit = 0;
        if(parseInt(cnpj[12]) != firstDigit) return false;

        let calc2: number = ( (parseInt(cnpj[12])*2) +
          (parseInt(cnpj[11])*3) + (parseInt(cnpj[10])*4) +
          (parseInt(cnpj[9])*5) + (parseInt(cnpj[8])*6) +
          (parseInt(cnpj[7])*7) + (parseInt(cnpj[6])*8) +
          (parseInt(cnpj[5])*9) + (parseInt(cnpj[4])*2) +
          (parseInt(cnpj[3])*3) + (parseInt(cnpj[2])*4) +
          (parseInt(cnpj[1])*5) + (parseInt(cnpj[0])*6)
        ) % 11;
        let secondDigit: number = 11 - calc2;
        if(secondDigit >= 10) secondDigit = 0;
        if(parseInt(cnpj[13]) != secondDigit) return false;
        return true;
      }
    }

}
