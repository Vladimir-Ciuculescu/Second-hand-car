import { IsEmail } from 'class-validator';

export class FindUsersAfterEmailDto {
  @IsEmail()
  email: string;
}
