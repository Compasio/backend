import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { PrismaService } from 'src/db/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class MapsService {
  constructor (
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  private readonly logger = new Logger(MapsService.name);

  async registerAddress(id: number, createMapDto: CreateMapDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if(!userExists) throw new NotFoundException("Usuário não encontrado");

    let address = `${createMapDto.num} ${createMapDto.street} ${createMapDto.neighborhood} ${createMapDto.city} ${createMapDto.state}`.replace(/\s+/g, '%20');
    let url = `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${process.env.MAP}`;

    const { data } = await firstValueFrom(
        this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Erro';
        })
      )
    )


    return this.prisma.address.create({
      data: {
        id_user: id,
        lat: data.features[0].geometry.coordinates[1],
        lng: data.features[0].geometry.coordinates[0]
      }
    })
    
  }

  async getAllAddress(page: number) {
    let requests;
    let count = await this.prisma.address.count({})

    if (page == 0){
      requests = await this.prisma.address.findMany({})
    }
    
    else if(page == 1){
      requests = await this.prisma.address.findMany({
        take: 20,
      });
    }
    else{
      requests = await this.prisma.address.findMany({
        take: 20,
        skip: (page - 1) * 20,
      });
    }
    if(requests[0] == undefined) return[];
    return{"requests": requests, "totalCount": count};
  }

  async getAddressFromOng(ongname: string) {
    const ong = await this.prisma.ong.findMany({
      where: {
        OR: [
          {ong_name: { contains: ongname, mode: 'insensitive' }},
        ],
      },
      take: 10,
    });
    
    if(!ong) throw new NotFoundException("ERROR: ong não encontrada");
    
    let coordinates = [];
    for(let i = 0; i < ong.length; i++) {
      let id = ong[i].id_ong;
      const address = await this.prisma.address.findUnique({
        where: {
          id_user: id,
        },
      });
      if(!address) continue;
      coordinates.push({"ongid": id, "ongname": ong[i].ong_name, "lat": address.lat, "lng": address.lng});
    }
    if(coordinates[0] == undefined) return[];

    return coordinates;
  }

  async getOngsByPlace(place: string) {

  }

  async getOngByCoordinate(lat: string, lng: string) {

  }

  async updateAddress(id: number) {

  }

  async deleteAddress(id: number) {

  }
}
