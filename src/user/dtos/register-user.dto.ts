import { IsEmail, IsString, Length ,Matches} from 'class-validator';
import { passwordRegex } from 'src/shared/util/regex';

export class RegisterUserDto {
  @IsString()
  @Length(3, 64)
  fullName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Length(8, 32)
  @Matches(passwordRegex)
  password: string;
}
