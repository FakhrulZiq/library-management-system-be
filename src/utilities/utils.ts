import { NotFoundException } from '@nestjs/common';
import { Audit } from 'src/domain/audit/audit';
import {
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
} from 'src/infrastucture/constant';
import { IRedisService } from 'src/infrastucture/redis/redisInterface';
import {
  IFindBookResponse,
  IListBookInpput,
} from 'src/interface/service/Book.service.interface';
import { IBorrowedBookListResponse } from 'src/interface/service/borrowedBook.service.interface';
import { IFindUserResponse } from 'src/interface/service/user.service.interface';

/**
 * Updates an object with new properties and adds an audit trail.
 * Merges the provided props into the data object, replacing any existing values.
 * Also adds the audit information to the data object.
 * @param props - The properties to update on the data object
 * @param data - The object to be updated
 * @param audit - The audit information to add to the data object
 * @returns The updated data object
 */
export const updateEntity = (
  props: Partial<any>,
  data: any,
  audit: Audit,
): any => {
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      data[key] = props[key];
    }
  }
  data.audit = audit;
  return data;
};

export const extractDateFromISOString = (ISODate: string): string => {
  if (!ISODate) return '-';
  const [datePart] = ISODate.split('T');
  return datePart;
};

/**
 * Paginates the given data based on the provided filter object and total records.
 *
 * @param {any[]} data
 * @param {(IListBookInpput)} inputObj
 * @param {number} total
 * @return {*}  {(IFindBookResponse | IBorrowedBookListResponse)}
 */
export const pagination = (
  data: any[],
  inputObj: IListBookInpput,
  total: number,
): IFindBookResponse | IBorrowedBookListResponse | IFindUserResponse => {
  const pageRecords = inputObj?.pageSize || PAGINATION?.defaultRecords;
  const page = inputObj?.pageNum;
  const totalPages = Math.ceil(total / pageRecords);
  const startRecord = (page - 1) * pageRecords + 1;
  const endRecord = Math.min(page * pageRecords, total);
  return {
    startRecord,
    endRecord,
    nextPage: totalPages > page ? page + 1 : null,
    total,
    totalPages,
    data,
  };
};

export const getDaysRemaining = (
  startDateISO: string,
  middleDateISO: string,
  endDateISO: string,
): number => {
  const startDate = new Date(startDateISO).getTime();
  let endDate: number;

  if (middleDateISO) {
    endDate = new Date(middleDateISO).getTime();
  } else {
    endDate = new Date(endDateISO).getTime();
  }

  const diffMilliseconds = endDate - startDate;
  const diffDays = Math.ceil(diffMilliseconds / (1000 * 60 * 60 * 24));

  return diffDays;
};
