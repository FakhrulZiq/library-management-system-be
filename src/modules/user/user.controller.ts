import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TYPES } from 'src/infrastucture/constant';
import {
  IUserByID,
  IUserService,
} from 'src/interface/service/user.service.interface';
import { RegisterResponse, UserByIdResponse } from './dto/userOutput.dto';
import { RegisterInput } from './dto/userInput.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
  ) {}

  @Get('listUser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all user' })
  listuser(): Promise<UserByIdResponse[]> {
    return this._userService.getUser();
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

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: RegisterResponse,
  })
  registerUser(@Body() input: RegisterInput): Promise<RegisterResponse> {
    return this._userService.register(input);
  }
}
