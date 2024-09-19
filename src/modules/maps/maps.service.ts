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
        }),
      ),
    );

    return this.prisma.address.create({
      data: {
        ...createMapDto,
        concat: address.split('%20').join(''),
        lat: data.features[0].geometry.coordinates[1],
        lng: data.features[0].geometry.coordinates[0]
      },
    });
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
      take: 30,
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

  async getOngsByPlace(placeOng: string) {
    let place: string = placeOng.split(' ').join('');
    console.log(place)
    const ongs = await this.prisma.address.findMany({
      where: {
        OR: [
          {
            concat: {
              contains: place, mode: 'insensitive',
            }
          },
        ],
      },
      include: {
        user: {
          include: {
            ong: true,
          },
        },
      },
      take: 30,
    });
    if(!ongs) throw new NotFoundException("ERROR: nenhuma Ong encontrada");
    let result = ongs.map((i) => ({"id_ong": i.id_user, "ong_name": i.user.ong.ong_name, "lat": i.lat, "lng": i.lng}))

    return result;
  }

  async getNearestOngs(userLat: number, userLng: number, radius: number) {
    const query = await this.prisma.$queryRaw<{id_user: number, lat: number, lng: number}[]>`
      SELECT id_user, lat, lng
      FROM "Address"
      WHERE ST_DWithin(
        ST_MakePoint(${userLng}, ${userLat})::geography, 
        ST_MakePoint(lng, lat)::geography, 
        ${radius} * 1000)`;

    const ongs = await this.prisma.user.findMany({
      where: {
        id: {
          in: query.map(({id_user}) => id_user)
        },
      },
      include: {
        ong: true,
        address: true,
      },
    });

    if(!ongs) return [];

    let result = ongs.map((i) => ({ "id_user": i.id, "ong_name": i.ong.ong_name, "lat": i.address.lat, "lng": i.address.lng }));
    return result;

  }

  async getAddressById(id: number) {
    const ong = await this.prisma.user.findUnique({
      where: {
        id,
        userType: 'ong',
      },
      include: {
        address: true,
      },
    });

    if(!ong) throw new NotFoundException("ERROR: não encontrado");

    delete ong.password;

    return ong;
  }

  async updateAddress(id: number, update: UpdateMapDto) {
    const ong = await this.prisma.address.findUnique({
      where: {
        id_user: id,
      },
    });

    if(!ong) throw new NotFoundException("Error: não encontrado");

    let address = `${update.num} ${update.street} ${update.neighborhood} ${update.city} ${update.state}`.replace(/\s+/g, '%20');
    let url = `https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${process.env.MAP}`;

    const { data } = await firstValueFrom(
      this.httpService.get(url).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Erro';
        }),
      ),
    );

    return this.prisma.address.update({
      where: {
        id_user: id,
      },
      data: {
        ...update,
        concat: address.split('%20').join(''),
        lat: data.features[0].geometry.coordinates[1],
        lng: data.features[0].geometry.coordinates[0]
      },
    });
  }

  async deleteAddress(id: number) {
    const address = await this.prisma.address.findUnique({
      where: {
        id_user: id,
      },
    });

    if(!address) throw new NotFoundException("Error: não encontrado");

    return this.prisma.address.delete({
      where: {
        id_user: id,
      },
    });
  }
}
