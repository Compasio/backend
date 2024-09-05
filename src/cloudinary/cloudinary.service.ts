import { ConflictException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import { ImgType } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async uploadFileToCloudinary(file: Express.Multer.File): Promise<CloudinaryResponse> {
    if(file.size > 500000) {
      throw new ConflictException("ERROR: arquivo muito grande");
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async registerPicInDb(url: string, user: number, type: ImgType, cloudName) {
    return this.prisma.imageResouce.create({
      data: {
        url,
        user,
        type,
        cloudName,
      },
    });
  }

  async deletePic(publicid) {
    return cloudinary.api.delete_resources([publicid]).then((result) => {});
  }
}