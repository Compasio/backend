import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../../db/prisma.service';
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, profilePic?: Express.Multer.File) {
    const {ong} = createProjectDto;
    const ongExist = await this.prisma.ong.findFirst({
      where: {
        id_ong:ong,
      },
    });

    if(!ongExist) throw new ConflictException("ERROR: Essa ONG não existe");

    let create = await this.prisma.project.create({
      data: {
        ...createProjectDto,
      },
    });

    if(profilePic) {
      let uploadProfilePic =
        await this.cloudinary.uploadFileToCloudinary(profilePic);
      let registerPic = await this.cloudinary.registerPicInDb(
        uploadProfilePic.url,
        create.ong,
        'project',
        uploadProfilePic.public_id,
        create.id_project
      );
    }

    return create;
  }

  async getAllProjects(page: number) {
    let res;
    let count = await this.prisma.project.count();
    if (page == 0) {
      res = await this.prisma.project.findMany({
        include: {
          ImageResource: {
            where: {
              type: "project",
            },
          },
        },
      });
    }
    else if (page == 1) {
      res = await this.prisma.project.findMany({
        take: 20,
        include: {
          ImageResource: {
            where: {
              type: "project",
            },
          },
        },
      });
    }
    else{
      res = await this.prisma.project.findMany({
        take:20,
        skip: (page - 1) * 20,
        include: {
          ImageResource: {
            where: {
              type: "project",
            },
          },
        },
      })
    }
    return {"response": res, "count": count};
  }

  async getAllProjectsByOng(ong: number, page: number) {
    let res;
    let count = await this.prisma.project.count({where: {ong}});

    if (page == 0) {
      res = await  this.prisma.project.findMany({
        where: {
          ong,
        },
        include: {
          ImageResource: {
            where: {
              type: "project",
            },
          },
        },
      });
    }
    else if (page == 1) {
      res = await  this.prisma.project.findMany({
        where: {
          ong,
        },
        take: 20,
        include: {
          ImageResource: {
            where: {
              type: "project",
            },
          },
        },
      });
    }
    else {
      res = await  this.prisma.project.findMany({
        where: {
          ong,
        },
        take: 20,
        skip: (page - 1) * 20,
        include: {
          ImageResource: {
            where: {
              type: "project",
            },
          },
        },
      });
    }
    return {"response": res, "count": count};
  }

  async getProjectsByName(name: string) {
    const projectNearest = await this.prisma.project.findMany({
      where: {
          OR: [
            { project_name: { contains: name, mode: 'insensitive' }},
          ]
      },
      include: {
        ImageResource: {
          where: {
            type: "project",
          },
        },
      },
    });

    if(!projectNearest) throw new NotFoundException('ERROR: Nenhum projeto com esse nome');

    return projectNearest;
  }

  async getProjectById(id: number) {
    const project = await this.prisma.project.findUnique({
      where: {
        id_project: id,
      },
      include: {
        ImageResource: {
          where: {
            type: "project",
          },
        },
      },
    });
    if(!project) throw new NotFoundException('ERROR: Projeto não encontrado');
    return project;
  }

  async updateProject(id: number, updateProjectDto: UpdateProjectDto) {
    const projectExists = await this.prisma.project.findUnique({
      where: {
        id_project: id,
      },
    });
    if(!projectExists) throw new NotFoundException('ERROR: Projeto não encontrado');

    return this.prisma.project.update({
      where: {
        id_project: id,
      },
      data: {
        ...updateProjectDto
      },
    });
  }

  async deleteProject(id: number) {
    const projectExists = await this.prisma.project.findUnique({
      where: {
        id_project: id,
      },
    });
    if(!projectExists) throw new NotFoundException('ERROR: Projeto não encontrado');

    const delProject = await this.prisma.project.delete({
      where: {
        id_project: id,
      },
    });

    return { success: true };
  }
}
