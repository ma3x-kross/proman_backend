import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AtJwtAuthGuard } from '../guard/at.guard';
import { RolesGuard } from '../guard/roles.guard';

export const ROLES_KEY = 'roles';

export const Auth = (...roles: string[]) => {
  if (roles.length == 0) return applyDecorators(UseGuards(AtJwtAuthGuard));
  return applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
};
