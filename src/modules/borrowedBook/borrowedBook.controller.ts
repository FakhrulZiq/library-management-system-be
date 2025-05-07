import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TYPES } from 'src/infrastucture/constant';
import { IBorrowedBookService } from 'src/interface/service/borrowedBook.service.interface';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  BorrowBookInput,
  BorrowedBookListInput,
  ReturnBookInput
} from './dto/borrowBookInput.dto';
import {
  BorrowBookOutput,
  BorrowedBookData,
  BorrowedListResponse,
  ReturnBookOutput,
} from './dto/borrowBookOutput.dto';

@ApiTags()
@ApiBearerAuth()
@Controller('borrowedBook')
export class BorrowedBookController {
  constructor(
    @Inject(TYPES.IBorrowedBookService)
    private readonly _borrowedBookService: IBorrowedBookService,
  ) {}

  @Post('borrow')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Student borrow a books' })
  async borrowBook(
    @Body() input: BorrowBookInput,
    @Req() req,
  ): Promise<BorrowBookOutput> {
    const email = req.user.email;
    return this._borrowedBookService.borrowBook(input, email);
  }

  @Get('transactions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get borrowed book by ID' })
  async getBorrowedById(@Param('id') id: string): Promise<BorrowedBookData> {
    return this._borrowedBookService.getBorrowedBookById(id);
  }

  @Post('return')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Student return a books' })
  async returnBook(
    @Body() input: ReturnBookInput,
    @Req() req,
  ): Promise<ReturnBookOutput> {
    const email = req.user.email;
    return this._borrowedBookService.returnBook(input, email);
  }

  @Post('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all borrowed books' })
  async listBooks(
    @Body() input: BorrowedBookListInput,
  ): Promise<BorrowedListResponse> {
    return this._borrowedBookService.getAllBorrowedBook(input);
  }

  @Post('student')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all borrowed books by student' })
  async borrowByStudent(
    @Body() input: BorrowedBookListInput,
  ): Promise<BorrowedListResponse> {
    return this._borrowedBookService.getBorrowBookByStudentId(input);
  }
}
