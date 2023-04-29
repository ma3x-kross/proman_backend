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

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto) {
    return await this.projectsService.create(dto);
  }

  @Post('related-project')
  async addRelatedProject(
    @Body() dto: { sourceProjectId: number; targetProjectId: number },
  ) {
    await this.projectsService.addRelatedProject(
      dto.sourceProjectId,
      dto.targetProjectId,
    );
  }

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

  @Post('developer')
  async assignDeveloper(
    @Body() dto: { developerId: number; projectId: number },
  ) {
    await this.projectsService.assignDeveloper(dto.developerId, dto.projectId);
  }

  @Delete('developer')
  async dismissDeveloper(
    @Query('developer') developerId: number,
    @Query('project') projectId: number,
  ) {
    return await this.projectsService.dismissDeveloper(developerId, projectId);
  }

  @Get()
  async getAll() {
    return await this.projectsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.projectsService.getById(id);
  }

  @Put(':id')
  async updateProject(@Param('id') id: number, @Body() dto: UpdateProjectDto) {
    return await this.projectsService.update(id, dto);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: number) {
    await this.projectsService.deleteProject(id);
  }
}
