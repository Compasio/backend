import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
  const {ong} = createProjectDto
  const ongExist = await this.prisma.ong.findFirst({
    where: {
      id_ong:ong,
    }
  })
    if(!ongExist) throw new ConflictException("ERROR: Essa ONG não existe")
    return this.prisma.project.create({
      data: {
        ...createProjectDto
      }
    })
  }

  async findAll(page:number) {
    let res 
    if (page == 0) {
      res = await this.prisma.project.findMany({})
      
    } else if (page == 1) {
      res = await this.prisma.project.findMany({take:20})
      
    }
    else{
      res = await this.prisma.project.findMany({take:20,skip: (page - 1) * 20,})
   
    } return res
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
