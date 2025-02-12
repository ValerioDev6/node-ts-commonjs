import { RoleType } from '../../user/dto/rol.enum';

export interface PayloadToken {
  id: string;
  role: RoleType;
  sub: string;
  email: string;
}
