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
  DashboardCardInput,
  ReturnBookInput,
} from './dto/borrowBookInput.dto';
import {
  BorrowBookOutput,
  BorrowedBookDashboardResponse,
  BorrowedBookData,
  BorrowedListResponse,
  IncomingDueResponse,
  RecentActivityResponse,
  ReturnBookOutput,
  TrendingBook,
} from './dto/borrowBookOutput.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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
  ): Promise<BorrowedBookData> {
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

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Dashboard data' })
  async dashboardData(@Req() req): Promise<BorrowedBookDashboardResponse> {
    const role = req.user.role;
    const userId = req.user.userId;
    return this._borrowedBookService.dashboardCard(userId, role);
  }

  @Get('trending-book')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'trending book data' })
  async trendingBook(): Promise<TrendingBook[]> {
    return this._borrowedBookService.trendingBook();
  }

  @Get('recent-activity')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'recent activity data' })
  async recentActivity(): Promise<RecentActivityResponse[]> {
    return this._borrowedBookService.recentActivities();
  }

  @Get('recent-activity-student')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'recent activity data' })
  async recentActivityByStudent(@Req() req): Promise<RecentActivityResponse[]> {
    const userId = req.user.userId;
    return this._borrowedBookService.recentActivitiesByStudent(userId);
  }

  @Get('incoming-due')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'incoming due data' })
  async incomingDue(): Promise<IncomingDueResponse[]> {
    return this._borrowedBookService.incomingDue();
  }

  @Get('incoming-due-student')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'incoming due data' })
  async incomingDueByStudent(@Req() req): Promise<IncomingDueResponse[]> {
    const userId = req.user.userId;
    return this._borrowedBookService.incomingDueByStudent(userId);
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
