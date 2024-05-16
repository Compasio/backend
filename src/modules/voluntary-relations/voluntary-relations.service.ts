import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoluntaryRelationDto } from './dto/create-voluntary-relation.dto';
import { UpdateVoluntaryRelationDto } from './dto/update-voluntary-relation.dto';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class VoluntaryRelationsService {
  constructor(private prisma: PrismaService) {}

  async createVoluntaryRelation(createvoluntaryRelationDto: CreateVoluntaryRelationDto) {
    const { voluntary, ong, project } = createvoluntaryRelationDto;
    const voluntaryExists = await this.prisma.user.findFirst({
      where: {
        id: voluntary,
        userType: "voluntary",
      },
    });
    const ongExists = await this.prisma.user.findFirst({
      where: {
        id: ong,
        userType: "ong",
      },
    });

    if(!voluntaryExists) throw new ConflictException("ERROR: Voluntário não existe");
    if(!ongExists) throw new ConflictException("ERROR: Ong não existe");

    if(project != null || project != undefined) {
      const projectExists = await this.prisma.project.findFirst({
        where: {
          id_project: project,
        },
      });
      if(!projectExists) throw new ConflictException("ERROR: Projeto não existe");
    }   

    return this.prisma.voluntaryRelations.create({
      data: {
        ...createvoluntaryRelationDto,
      },
    });
  }

  async getAllRelationsByVoluntary(voluntary: number, page: number) {
    let relations;
    let count = await this.prisma.voluntaryRelations.count({where: {voluntary}})
    if(page == 0) {
      relations = await this.prisma.voluntaryRelations.findMany({
        where: {
          voluntary,
        },
      });
    } 
    else if(page == 1) {
      relations = await this.prisma.voluntaryRelations.findMany({
        where: {
          voluntary,
        },
        take: 20,
      });
    } 
    else {
      relations = await this.prisma.voluntaryRelations.findMany({
        where: {
          voluntary,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }

    if(relations[0] == undefined) return [];
    return {"relations": relations, "totalCount": count};
  }

  async getAllRelationsByOng(ong: number, page: number) {
    let relations;
    let count = await this.prisma.voluntaryRelations.count({where: {ong}})

    if(page == 0) {
      relations = await this.prisma.voluntaryRelations.findMany({
        where: {
          ong,
        },
      });
    }
    else if(page == 1) {
      relations = await this.prisma.voluntaryRelations.findMany({
        where: {
          ong,
        },
        take: 20,
      });
    } else {
      relations = await this.prisma.voluntaryRelations.findMany({
        where: {
          ong,
        },
        take: 20,
        skip: (page-1)*20,
      });
    }

    if(relations[0] == undefined) return [];
    return {"relations": relations, "totalCount": count};
  }

  async getVoluntaryRelationById(id: number) {
    const relation = await this.prisma.voluntaryRelations.findUnique({
      where: {
        id_relation: id,
      },
    });
    if(!relation) throw new NotFoundException("ERROR: Relação não encontrada");
    console.log(typeof relation)
    return relation;
  }

  async updateVoluntaryRelation(id: number, updatevoluntaryRelationDto: UpdateVoluntaryRelationDto) {
    const relation = await this.prisma.voluntaryRelations.findUnique({
      where: {
        id_relation: id,
      },
    });
    if(!relation) throw new NotFoundException("ERROR: Relação não encontrada");
    return this.prisma.voluntaryRelations.update({
      data: {
        ...updatevoluntaryRelationDto,
      },
      where: {
        id_relation: id,
      },
    });
  }

  async removeVoluntaryRelation(id: number) {
    const relation = await this.prisma.voluntaryRelations.findUnique({
      where: {
        id_relation: id,
      },
    });
    if(!relation) throw new ConflictException("ERROR: Relação não encontrada");
    return this.prisma.voluntaryRelations.delete({
      where: {
        id_relation: id,
      },
    });
  }
}
