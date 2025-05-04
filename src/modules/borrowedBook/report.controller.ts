import {
    Controller,
    Inject
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TYPES } from 'src/infrastucture/constant';
import { IBorrowedBookService } from 'src/interface/service/borrowedBook.service.interface';

@ApiTags()
@ApiBearerAuth()
@Controller('reports')
export class BorrowedBookController {
  constructor(
    @Inject(TYPES.IBorrowedBookService)
    private readonly _borrowedBookService: IBorrowedBookService,
  ) {}

  
}
