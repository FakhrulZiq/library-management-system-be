import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TYPES } from 'src/infrastucture/constant';
import { IBookService } from 'src/interface/service/Book.service.interface';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  AddNewBookInput,
  FindBookData,
  FindBookInput,
  FindBookResponse,
  ListBookInput,
  UpdateBookInput,
} from './dto/bookInput.dto';
import { AddBookResponse, DeleteBookResponse } from './dto/bookOutput.dto';

@ApiTags('book')
@ApiBearerAuth()
@Controller('book')
export class BookController {
  constructor(
    @Inject(TYPES.IBookService)
    private readonly _bookService: IBookService,
  ) {}

  @Get('listBook')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all books' })
  async listBooks(@Body() input: ListBookInput): Promise<FindBookResponse> {
    return this._bookService.listBook(input);
  }

  @Post('addManyBook')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Add multiple books in bulk' })
  async addManyBooks(
    @Body() inputs: AddNewBookInput[],
    @Req() req,
  ): Promise<AddBookResponse> {
    const email = req.user.email;
    return this._bookService.addManyBooks(inputs, email);
  }

  @Post('findBook')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Find multiple books' })
  async findBook(@Body() input: FindBookInput): Promise<FindBookData[]> {
    return this._bookService.findBook(input);
  }

  @Post('updateBook')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Update books' })
  async updateBook(
    @Body() input: UpdateBookInput,
    @Req() req,
  ): Promise<FindBookData> {
    const email = req.user.email;
    return this._bookService.updateBook(input, email);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Delete book by ID' })
  deleteBook(@Param('id') id: string, @Req() req): Promise<DeleteBookResponse> {
    const email = req.user.email;
    return this._bookService.deleteBook(id, email);
  }
}
