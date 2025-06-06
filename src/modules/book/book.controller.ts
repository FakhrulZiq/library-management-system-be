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
  ListBookInput,
  UpdateBookInput,
} from './dto/bookInput.dto';
import { AddBookResponse, DeleteBookResponse, FindBookResponse } from './dto/bookOutput.dto';

@ApiTags('book')
@ApiBearerAuth()
@Controller('book')
export class BookController {
  constructor(
    @Inject(TYPES.IBookService)
    private readonly _bookService: IBookService,
  ) {}

  @Post('listBook')
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get book by ID' })
  getBookById(@Param('id') id: string): Promise<FindBookData> {
    return this._bookService.getBookById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'Update books' })
  async updateBook(
    @Param('id') id: string,
    @Body() input: UpdateBookInput,
    @Req() req,
  ): Promise<FindBookData> {
    const email = req.user.email;
    return this._bookService.updateBook(id, input, email);
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
