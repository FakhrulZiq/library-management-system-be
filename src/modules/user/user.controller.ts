import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TYPES } from 'src/infrastucture/constant';
import {
  IUserService
} from 'src/interface/service/user.service.interface';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  ChangeUserPasswordInput,
  ListUserInput,
  RegisterInput,
  UpdateUserInput,
} from './dto/userInput.dto';
import {
  DeleteResponse,
  FindUserResponse,
  RegisterResponse,
  UserByIdResponse,
} from './dto/userOutput.dto';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
  ) {}

  @Post('listUser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'List all user' })
  async listuser(@Body() input: ListUserInput): Promise<FindUserResponse> {
    return this._userService.getUser(input);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserInput,
    @Req() req,
  ): Promise<UserByIdResponse> {
    const email = req.user.email;
    return this._userService.updateUser(id, input, email);
  }

  @Put('change-password/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update password' })
  async updatePassowrd(
    @Param('id') id: string,
    @Body() input: ChangeUserPasswordInput,
    @Req() req,
  ): Promise<UserByIdResponse> {
    const email = req.user.email;
    return this._userService.resetPassword(id, input, email);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: UserByIdResponse,
  })
  getUser(@Param('id') id: string): Promise<UserByIdResponse> {
    return this._userService.findById(id);
  }

  @Post('register')
  @UseGuards()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: RegisterResponse,
  })
  registerUser(@Body() input: RegisterInput): Promise<RegisterResponse> {
    return this._userService.register(input);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Delete User by ID' })
  deleteUser(@Param('id') id: string, @Req() req): Promise<DeleteResponse> {
    const email = req.user.email;
    return this._userService.deleteUser(id, email);
  }
}
