import { ApiProperty } from '@nestjs/swagger';
import { ProfileModel } from '../../profile/profile.model';
import { RolesModel } from '../../roles/models/roles.model';

export interface User {
  id: number;
  email: string;
}
export interface UserWithTokens extends User {
  accessToken: string;
  refreshToken: string;
}

export class AuthResponse {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор' })
  id: number;
  @ApiProperty({ example: 'test@mail.ru', description: 'Электронная почта' })
  email: string;
  @ApiProperty({ type: [RolesModel] })
  roles: RolesModel[];
  @ApiProperty({ type: ProfileModel })
  profile: ProfileModel;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.ea_fFiR-rceB1xYxlfQ7QNCNXTkBtHuqoErr2cfEM6Q',
    description: 'JWT токен доступа',
  })
  accessToken: string;
}
