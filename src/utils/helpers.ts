import { UserModel } from '../users/user.model';
import { RolesModel } from '../roles/models/roles.model';

export const removeExtraFromReturnedFields = (user: UserModel) => {
  const userObject = user.toJSON();
  delete userObject.password;
  userObject.roles = userObject.roles.map(
    (role) => ({ value: role.value } as RolesModel),
  );
  return userObject;
};
