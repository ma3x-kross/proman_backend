import { ProjectStatus } from '../models/projects.model';

export class CreateProjectDto {
  name: string;

  status: ProjectStatus;

  deadline: Date;

  plannedHours: number;

  rate: number;

  managerId: number;

  developersIds: number | number[];

  relatedProjectId?: number;
}
