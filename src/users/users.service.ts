import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  async createUser(email: string, password: string) {
    const userObject = this.usersRepository.create({ email, password });

    const user = await this.usersRepository.save(userObject);

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException({ error: 'This user does not exist !' }, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findOne(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException({ error: 'This user does not exist !' }, HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new HttpException({ error: 'This user does not exist !' }, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findUserById(id: number) {
    if (!id) {
      throw new HttpException({ error: 'Unauthorized access !' }, HttpStatus.FORBIDDEN);
    }
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

  async getAllUsers() {
    const users = await this.usersRepository.find();

    return users;
  }

  // async removeUser(id: number) {
  //   const user = await this.findUserById(id);

  //   if (!user) {
  //     throw new HttpException({ error: 'User not found' }, HttpStatus.NOT_FOUND);
  //   }

  //   return this.usersRepository.remove(user);
  // }
}
