import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const throwApplicationError = (status: number, error: string) => {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(error);
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(error);
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(error);
    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(error);
    case HttpStatus.INTERNAL_SERVER_ERROR:
      throw new InternalServerErrorException(error);
    default:
      throw new HttpException({ status, error }, status);
  }
};
