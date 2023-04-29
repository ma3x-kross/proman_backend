import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectsModel } from './models/projects.model';
import { CreateProjectDto } from './dto/create.project.dto';
import { UserModel } from '../users/user.model';
import { DeveloperProjectsModel } from './models/developer.projects.model';
import { UpdateProjectDto } from './dto/update.project.dto';
import { RelatedProjectsModel } from './models/related.projects.model';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(ProjectsModel) private projectsModel: typeof ProjectsModel,
    @InjectModel(UserModel) private userModel: typeof UserModel,
    @InjectModel(DeveloperProjectsModel)
    private developerProjectsModel: typeof DeveloperProjectsModel,
    @InjectModel(RelatedProjectsModel)
    private relatedProjectModel: typeof RelatedProjectsModel,
  ) {}

  async create(dto: CreateProjectDto) {
    const existProject = await this.getByName(dto.name);
    if (existProject)
      throw new BadRequestException('Проект с данным именем ужу существует');
    const manager = await this.userModel.findByPk(dto.managerId);
    if (!manager) throw new BadRequestException('Менеджер не найден');
    const project = await this.projectsModel.create(dto);
    if (dto.developersIds) {
      if (Array.isArray(dto.developersIds)) {
        dto.developersIds.map(async (developerId) => {
          await this.assignDeveloper(developerId, project.id);
        });
      } else {
        await this.assignDeveloper(dto.developersIds, project.id);
      }
    }
    if (dto.relatedProjectId) {
      await this.addRelatedProject(project.id, dto.relatedProjectId);
      // const relatedProject = await this.projectsModel.findByPk(
      //   dto.relatedProjectId,
      // );
      // if (!relatedProject || project.id === dto.relatedProjectId) {
      //   throw new BadRequestException('Связанный проект не найден');
      // }
      // await project.$add('relatedProjects', relatedProject.id);
    }
    return await this.getById(project.id);
  }

  async addRelatedProject(sourceProjectId: number, targetProjectId: number) {
    if (sourceProjectId === targetProjectId)
      throw new BadRequestException('Проект для связи не может быть исходным');
    const sourceProject = await this.projectsModel.findByPk(sourceProjectId);
    if (!sourceProject) {
      throw new BadRequestException('Исходный проект не найден');
    }
    const targetProject = await this.projectsModel.findByPk(targetProjectId);
    if (!targetProject) {
      throw new BadRequestException('Связанный проект не найден');
    }
    await sourceProject.$add('relatedProjects', targetProject.id);
  }

  async deleteRelatedProject(sourceProjectId: number, targetProjectId: number) {
    const value = await this.relatedProjectModel.findOne({
      where: { sourceProjectId, targetProjectId },
    });
    if (!value)
      throw new BadRequestException('Не найдена связь между проектами');
    await value.destroy();
  }

  async assignDeveloper(userId: number, projectId: number) {
    const developer = await UserModel.findByPk(userId);
    if (!developer) throw new BadRequestException('Пользователь не найден');
    const project = await ProjectsModel.findByPk(projectId);
    if (!project) throw new BadRequestException('Проект не найден');
    await project.$add('developers', developer.id);
  }

  async dismissDeveloper(userId: number, projectId: number) {
    const value = await DeveloperProjectsModel.findOne({
      where: { userId, projectId },
    });
    if (!value)
      throw new BadRequestException(
        'Не найдена связь между разработчиком и проектом',
      );
    await value.destroy();
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.projectsModel.findByPk(id);
    if (!project) throw new BadRequestException('Проект не найден');
    if (dto.name) {
      const isSameProject = await this.getByName(dto.name);
      if (isSameProject && project.id != isSameProject.id)
        throw new BadRequestException('Данное имя проекта занято');
    }
    if (dto.managerId) {
      const manager = await this.userModel.findByPk(dto.managerId);
      if (!manager) throw new BadRequestException('Менеджер не найден');
    }
    await project.update(dto);
    return await this.getById(project.id);
  }

  async getById(id: number) {
    const project = await this.projectsModel.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: UserModel,
          as: 'manager',
          attributes: ['id', 'email'],
          required: false,
          include: ['profile'],
        },
        {
          model: UserModel,
          as: 'developers',
          attributes: ['id', 'email'],
          through: { attributes: [] },
          include: ['profile'],
        },
        {
          model: ProjectsModel,
          as: 'relatedProjects',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });
    if (!project) throw new BadRequestException('Проект не найден');
    return project;
  }

  async getAll() {
    const projects = await this.projectsModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: UserModel,
          as: 'manager',
          attributes: ['id', 'email'],
          required: false,
          include: ['profile'],
        },
        {
          model: UserModel,
          as: 'developers',
          attributes: ['id', 'email'],
          through: { attributes: [] },
          include: ['profile'],
        },
        {
          model: ProjectsModel,
          as: 'relatedProjects',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
    });
    if (!projects) throw new BadRequestException('Проекты не найден');
    return projects;
  }

  async deleteProject(id: number) {
    const project = await this.projectsModel.findByPk(id);
    if (!project) throw new BadRequestException('Проект не найден');
    await project.destroy();
  }

  async getByName(name: string) {
    return await this.projectsModel.findOne({
      where: { name },
      include: { all: true },
    });
  }
}
