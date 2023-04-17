import { UserModel } from '../users/user.model';

export const removePasswordFromReturnedFields = (user: UserModel) => {
  const userObject = user.toJSON();
  delete userObject.password;
  return userObject;
};
