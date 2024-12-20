import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user-profile.dto';
import { BaseController, CommandRpc, QueryRpc } from '../utils';
import { GetUserProfileDto, GetUsersByUsernameOrMobileDto } from './dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('api/v1/users')
export class UsersController extends BaseController {
  logger = new Logger(UsersController.name)
  constructor(private readonly service: UsersService) {
    super(service);
  }

  @Post()
  @ApiOperation({description:'create user'})
  @CommandRpc('users', 'users', 'create_user')
  async createUser(@Body()data: CreateUserDto): Promise<any> {
    this.logger.verbose(this.createUser.name)
    const { __meta, ...d } = data;
    return this.service.createUser(d);
  }

  @Get('/:id/profile')
  @ApiOperation({description:'getUserProfile'})
  @ApiParam({ name: 'id', example: 'ab51d4d3-e8d3-4754-828d-f943237ecd6f' })
  @QueryRpc('users', 'users', 'get_user_profile')
  async getUserProfile(data: GetUserProfileDto): Promise<any> {
    const { __meta, ...d } = data;
    return this.service.getUserProfile(d, __meta);
  }

  // DO NOT EXPOSE IN GW!
  @ApiOperation({description:'getUsersByUsernameOrMobile which is not to be exposed !'})
  @QueryRpc('users', 'users', 'get_users_by_username_or_mobile')
  async getUsersByUsernameOrMobile(data: GetUsersByUsernameOrMobileDto): Promise<any> {
    this.logger.verbose('getUsersByUsernameOrMobile')
    const { __meta, ...d } = data;
    return this.service.getUsersByUsernameOrMobile(d, __meta);
  }

  // @MessagePattern('updateUser')
  // updateUserProfile(@Payload() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(updateUserDto.id, updateUserDto);
  // }
}
