import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  createUser(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });

    this.usersRepository.save(user);
  }

  async findUserById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    return user;
  }

  findUsersByEmail(email: string) {
    const users = this.usersRepository.find({ where: { email } });
    return users;
  }

  async updateUser(id: number, payload: Partial<User>) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException();
    }
    Object.assign(user, payload);

    this.usersRepository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new HttpException({ error: 'User not found' }, HttpStatus.NOT_FOUND);
    }

    return this.usersRepository.remove(user);
  }
}
