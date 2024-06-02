import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMapDto } from './dto/create-map.dto';
import { UpdateMapDto } from './dto/update-map.dto';
import { PrismaService } from 'src/db/prisma.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { error } from 'console';
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

    //const address = `${createMapDto.num}%20${createMapDto.street.replace(/\s+/g, '%20')}%20${createMapDto.neighborhood.replace(/\s+/g, '%20')}%20${createMapDto.city.replace(/\s+/g, '%20')}%20${createMapDto.state}`;
    let address = "Los%20Angeles"
    console.log(`https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${process.env.MAP}`)
    console.log(address);

    const { data } = await firstValueFrom(
      this.httpService.get(`https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${process.env.MAP}&autocomplete=true&country=BR`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'Erro';
        })
      )
    )

    console.log(data);
    for(let i = 0; i < 5; i++) {
      console.log(data.features[i].geometry)
    }
    
  }

  findAll() {
    return `This action returns all maps`;
  }

  findOne(id: number) {
    return `This action returns a #${id} map`;
  }

  update(id: number, updateMapDto: UpdateMapDto) {
    return `This action updates a #${id} map`;
  }

  remove(id: number) {
    return `This action removes a #${id} map`;
  }
}
