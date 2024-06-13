import * as nodemailer from 'nodemailer';
import {
    ConflictException,
    Delete,
    Injectable,
    NotFoundException,
    Request
  } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class EmailAuthService {
    constructor(
        private prisma: PrismaService
    ) {}

    async generateAndSendEmailVerifyCode(dto) {        
        const code = Math.floor(100000 + Math.random() * 900000).toString();

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
                to: dto.email,
                subject: "Verificação de Email Compasio",
                html: `<p>Olá, você está recebendo este email para criar sua conta Compassio!<p> <br />  <b>${code}</b>`
            };

            transporter.sendMail(mail, function(e, info) {
                if(e) {
                    console.log(e)
                    return false;
                } else {
                    return info;
                }
            });

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

            return true;
        }
        catch(e) {
            console.log(e)
            throw new Error("Erro ao gerar código, por favor tente novamente");
        }
            
    }

    /* 
    ======TODO======
    -CRIAR FLAG PARA NÃO PRECISAR VERIFICAR EMAIL EM TESTES
    
    */
    async verifyUserCreation(code: string) {
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
}