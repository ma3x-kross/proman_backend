import { RolesModel } from '../roles/models/roles.model';
import { ProfileModel } from '../profile/profile.model';
import { UserModel } from '../users/user.model';
import { ProjectsModel } from '../projects/models/projects.model';

export const userQueryOptions = {
  attributes: ['id', 'email'],
  include: [
    {
      model: RolesModel,
      as: 'roles',
      attributes: ['value'],
      through: { attributes: [] },
    },
    {
      model: ProfileModel,
      as: 'profile',
      attributes: { exclude: ['id', 'userId'] },
    },
  ],
};

export const projectQueryOptions = {
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
};
