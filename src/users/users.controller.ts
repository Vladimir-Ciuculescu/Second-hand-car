import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { FindUsersAfterEmailDto } from './dtos/find-users-after-email.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { email, password } = body;
    this.usersService.createUser(email, password);
    return res.status(201).json({ message: 'User created !' });
  }

  @UseInterceptors(SerializeInterceptor)
  @HttpCode(200)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    const user = await this.usersService.findUserById(parseInt(id));
    if (!user) {
      throw new HttpException({ error: 'User not found !' }, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Get('')
  async findUsers(@Query() queryParams: FindUsersAfterEmailDto, @Res() res: Response) {
    const { email } = queryParams;

    const users = await this.usersService.findUsersByEmail(email);

    return res.status(200).json(users);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Query() queryParams: UpdateUserDto, @Res() res: Response) {
    this.usersService.updateUser(parseInt(id), queryParams);

    return res.status(HttpStatus.ACCEPTED).json({ message: 'User updated !' });
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string, @Res() res: Response) {
    await this.usersService.removeUser(parseInt(id));

    return res.status(201).json({ message: 'User deleted !' });
  }
}
