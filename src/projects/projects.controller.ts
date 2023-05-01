import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create.project.dto';
import { UpdateProjectDto } from './dto/update.project.dto';
import { User } from '../users/decorators/user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Auth('ADMIN', 'MANAGER')
  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectsService.create(dto);
  }

  @Auth('ADMIN', 'MANAGER')
  @Post('related-project')
  async addRelatedProject(
    @Body() dto: { sourceProjectId: number; targetProjectId: number },
  ) {
    await this.projectsService.addRelatedProject(
      dto.sourceProjectId,
      dto.targetProjectId,
    );
  }

  @Auth('ADMIN', 'MANAGER')
  @Delete('related-project')
  async deleteRelatedProject(
    @Query('source') sourceProjectId: number,
    @Query('target') targetProjectId: number,
  ) {
    await this.projectsService.deleteRelatedProject(
      sourceProjectId,
      targetProjectId,
    );
  }

  @Auth('ADMIN', 'MANAGER')
  @Post('developer')
  async assignDeveloper(
    @Body() dto: { developerId: number; projectId: number },
  ) {
    await this.projectsService.assignDeveloper(dto.developerId, dto.projectId);
  }

  @Auth('ADMIN', 'MANAGER')
  @Delete('developer')
  async dismissDeveloper(
    @Query('developer') developerId: number,
    @Query('project') projectId: number,
  ) {
    return await this.projectsService.dismissDeveloper(developerId, projectId);
  }

  @Auth('ADMIN', 'MANAGER')
  @Get()
  async getAll() {
    return await this.projectsService.getAll();
  }

  @Auth()
  @Get('my')
  async getAllMyProjects(@User('id') id: number) {
    return await this.projectsService.getAllMyProjects(id);
  }

  @Auth()
  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.projectsService.getById(id);
  }

  @Auth('ADMIN', 'MANAGER')
  @Put(':id')
  async updateProject(@Param('id') id: number, @Body() dto: UpdateProjectDto) {
    return await this.projectsService.update(id, dto);
  }

  @Auth('ADMIN', 'MANAGER')
  @Delete(':id')
  async deleteProject(@Param('id') id: number) {
    await this.projectsService.deleteProject(id);
  }
}
