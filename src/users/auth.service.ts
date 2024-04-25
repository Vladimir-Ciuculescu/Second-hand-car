import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(payload: CreateUserDto) {
    const { email, password } = payload;

    const users = await this.usersService.findUsersByEmail(email);

    if (users.length) {
      throw new HttpException({ error: 'This email address is already in use !' }, HttpStatus.NOT_ACCEPTABLE);
    }

    const user = this.usersService.createUser(email, password);

    return user;
  }

  async login(email, password) {
    const user = await this.usersService.findOne(email, password);

    return user;
  }
}
