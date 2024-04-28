import { IsString } from 'class-validator';

export class CreateConferenceDto {
  @IsString()
  name!: string;
}
