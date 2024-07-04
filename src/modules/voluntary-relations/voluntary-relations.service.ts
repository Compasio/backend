import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateVoluntaryRelationDto } from './dto/create-voluntary-relation.dto';
import { UpdateVoluntaryRelationDto } from './dto/update-voluntary-relation.dto';
import { PrismaService } from 'src/db/prisma.service';
import { User, UserType } from '@prisma/client';

@Injectable()
export class VoluntaryRelationsService {
  constructor(private prisma: PrismaService) {}

  async requestVoluntaryRelation(voluntary: number, ong: number, project: number, userType: UserType) {
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

    return this.prisma.relationRequests.create({
      data: {
        voluntary,
        ong,
        project,
        userTypeWhoRequested: userType,
      },
    });
  }

  async acceptVoluntaryRelation(voluntary: number, ong: number, userType: UserType, createvoluntaryRelationDto: CreateVoluntaryRelationDto) {
    const requestExists = await this.prisma.relationRequests.findUnique({
      where: {
        voluntary_ong: {
          voluntary,
          ong,
        },
      },
    });

    if(!requestExists) throw new NotFoundException("ERROR: request não existe");
    if(requestExists.userTypeWhoRequested == userType) throw new UnauthorizedException();

    const createVoluntaryRelation = await this.prisma.voluntaryRelations.create({
      data: {
        voluntary,
        ong,
        project: requestExists.project,
        ...createvoluntaryRelationDto,
      },
    });

    const delFromRequestList = await this.prisma.relationRequests.delete({
      where: {
        voluntary_ong: {
          voluntary,
          ong,
        },
      },
    });

    await Promise.all([createVoluntaryRelation, delFromRequestList]);

    return { success: true };
  }

  async refuseVoluntaryRelation(voluntary: number, ong: number) {
    const requestExists = await this.prisma.relationRequests.findUnique({
      where: {
        voluntary_ong: {
          voluntary,
          ong,
        },
      },
    });

    if(!requestExists) throw new NotFoundException("ERROR: request não existe");

    return this.prisma.relationRequests.delete({
      where: {
        voluntary_ong: {
          voluntary,
          ong,
        },
      },
    });
  }

  async getAllRequestsByOng(ong: number, page: number) {
    let requests;
    let count = await this.prisma.relationRequests.count({where: {ong}});

    if(page == 0) {
      requests = await this.prisma.relationRequests.findMany({
        where: {
          ong,
        },
      });
    } 
    else if(page == 1) {
      requests = await this.prisma.relationRequests.findMany({
        where: {
          ong,
        },
        take: 20,
      });
    }
    else {
      requests = await this.prisma.relationRequests.findMany({
        where: {
          ong,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }

    if(requests[0] == undefined) return [];
    return {"requests": requests, "totalCount": count};
  }

  async getAllRequestsByVoluntary(page: number, voluntary: number) {
    let requests;
    let count = await this.prisma.relationRequests.count({where: {voluntary}});

    if(page == 0) {
      requests = await this.prisma.relationRequests.findMany({
        where: {
          voluntary,
        },
      });
    } 
    else if(page == 1) {
      requests = await this.prisma.relationRequests.findMany({
        where: {
          voluntary,
        },
        take: 20,
      });
    }
    else {
      requests = await this.prisma.relationRequests.findMany({
        where: {
          voluntary,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }

    if(requests[0] == undefined) return [];
    return {"requests": requests, "totalCount": count};
  }

  async getAllRelationsByVoluntary(voluntary: number, page: number) {
    let relations;
    let count = await this.prisma.voluntaryRelations.count({where: {voluntary}});
    
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

  async getAllRequestsByProject(page: number, project: number) {
    let res;
    let count = await this.prisma.relationRequests.count({where: {project}});

    if(count == 0) return [];

    if(page == 0) {
      res = await this.prisma.relationRequests.findMany({
        where: {
          project,
        },
      });
    }
    else if(page == 1) {
      res = await this.prisma.relationRequests.findMany({
        where: {
          project,
        },
        take: 20,
      });
    }
    else {
      res = await this.prisma.relationRequests.findMany({
        where: {
          project,
        },
        take: 20,
        skip: (page - 1) * 20
      });
    }

    return {"relations": res, "totalCount": count};
  }

  async getAllRelationsByProject(page: number, project: number) {
    let res;
    let count = await this.prisma.voluntaryRelations.count({where: {project}});

    if(count == 0) return [];

    if(page == 0) {
      res = await this.prisma.voluntaryRelations.findMany({
        where: {
          project,
        },
      });
    }
    else if(page == 1) {
      res = await this.prisma.voluntaryRelations.findMany({
        where: {
          project,
        },
        take: 20,
      });
    }
    else {
      res = await this.prisma.voluntaryRelations.findMany({
        where: {
          project,
        },
        take: 20,
        skip: (page - 1) * 20,
      });
    }

    return {"relations": res, "totalCount": count};
  }

  async getVoluntaryRelationById(id: number) {
    const relation = await this.prisma.voluntaryRelations.findUnique({
      where: {
        id_relation: id,
      },
    });
    if(!relation) throw new NotFoundException("ERROR: Relação não encontrada");

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
