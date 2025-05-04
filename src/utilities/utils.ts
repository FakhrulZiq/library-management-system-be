import { Audit } from 'src/domain/audit/audit';
import { PAGINATION } from 'src/infrastucture/constant';
import {
  IFindBookResponse,
  IListBookInpput,
} from 'src/interface/service/Book.service.interface';

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
  const [datePart] = ISODate.split('T');
  return datePart;
};

export const pagination = (
  data: any[],
  inputObj: IListBookInpput,
  total: number,
): IFindBookResponse => {
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
