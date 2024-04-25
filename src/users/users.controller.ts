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
  Session,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Response } from 'express';
import { FindUsersAfterEmailDto } from './dtos/find-users-after-email.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/decorators/serialize.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { User } from './user.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('users')
// @UseInterceptors(CurrentUserInterceptor)
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  // @Get('/current-user')
  // async getCurrentUser(@Session() session: any) {
  //   return this.usersService.findUserById(session.userId);
  // }

  @Get('/current-user')
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('/register')
  @HttpCode(201)
  async addUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body);

    session.userId = user;

    return user;
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    session.userId = user.id;

    return user;
  }

  @Post('/log-out')
  logOut(@Session() session: any) {
    session.userId = undefined;

    return 'User logged out';
  }

  @Post('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  // @Serialize(UserDto)
  // @HttpCode(200)
  // @Get('/:id')
  // async findUser(@Param('id') id: string) {
  //   console.log('handler is running');
  //   const user = await this.usersService.findUserById(parseInt(id));
  //   if (!user) {
  //     throw new HttpException({ error: 'User not found !' }, HttpStatus.NOT_FOUND);
  //   }

  //   return user;
  // }

  // @Serialize(UserDto)
  // @HttpCode(200)
  // @Get('')
  // async findUsers(@Query() queryParams: FindUsersAfterEmailDto) {
  //   const { email } = queryParams;

  //   const users = await this.usersService.findUsersByEmail(email);

  //   console.log(333, users);

  //   return users;
  // }

  // @Patch('/:id')
  // updateUser(@Param('id') id: string, @Query() queryParams: UpdateUserDto, @Res() res: Response) {
  //   this.usersService.updateUser(parseInt(id), queryParams);

  //   return res.status(HttpStatus.ACCEPTED).json({ message: 'User updated !' });
  // }

  // @Delete('/:id')
  // async removeUser(@Param('id') id: string, @Res() res: Response) {
  //   await this.usersService.removeUser(parseInt(id));

  //   return res.status(201).json({ message: 'User deleted !' });
  // }
}
