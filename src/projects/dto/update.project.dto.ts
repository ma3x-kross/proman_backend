import { ProjectStatus } from '../models/projects.model';

export class UpdateProjectDto {
  name?: string;

  status?: ProjectStatus;

  deadline?: Date;

  plannedHours?: number;

  rate?: number;

  managerId?: number;
}
