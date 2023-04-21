import { UserModel } from '../users/user.model';
import { RolesModel } from '../roles/models/roles.model';
import { genSalt, hash } from 'bcryptjs';

export const removeExtraFromReturnedFields = (user: UserModel) => {
  const userObject = user.toJSON();
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.activationExpire;
  delete userObject.activationLink;
  userObject.roles = userObject.roles.map(
    (role) => ({ value: role.value } as RolesModel),
  );
  return userObject;
};

export const hashValue = async (value: string) => {
  const salt = await genSalt(10);
  return await hash(value, salt);
};
