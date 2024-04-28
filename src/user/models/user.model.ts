import { Exclude, Expose } from 'class-transformer';

export class UserModel {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;

  @Expose()
  createdAt: string;
}
