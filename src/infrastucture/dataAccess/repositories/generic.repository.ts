import { HttpStatus, Injectable } from '@nestjs/common';
import { throwApplicationError } from 'src/infrastucture/logger/exception.instance';
import { IGenericRepository } from 'src/interface/genricRepository.interface';
import { IMapper } from 'src/interface/mapper.interface';
import { FindManyOptions, FindOneOptions, IsNull, Repository } from 'typeorm';

@Injectable()
export class GenericSqlRepository<TEntity, TModel>
  implements IGenericRepository<TEntity, TModel>
{
  constructor(
    protected readonly repository: Repository<TModel>,
    protected readonly mapper?: IMapper<TEntity, TModel>,
  ) {}

  private applySoftDeleteFilter(
    findOptions?: FindManyOptions | FindOneOptions,
  ): FindOneOptions | FindManyOptions {
    let options = findOptions;
    if (!options) {
      options = { where: {} };
    }

    if (!options?.where) {
      options.where = {
        auditDeletedBy: IsNull(),
        auditDeletedDateTime: IsNull(),
      };
    } else {
      (options.where as any).auditDeletedBy = IsNull();
      (options.where as any).auditDeletedDateTime = IsNull();
    }
    return options;
  }

  private findOneOption(findOneOptions?: FindOneOptions<TModel>) {
    try {
      const findOne: FindOneOptions<TModel> = <FindOneOptions>(
        this.applySoftDeleteFilter(findOneOptions)
      );
      return findOne;
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  private findManyOption(findManyOptions?: FindManyOptions<TModel>) {
    try {
      const findMany: FindManyOptions<TModel> = <FindManyOptions>(
        this.applySoftDeleteFilter(findManyOptions)
      );
      return findMany;
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async find(findManyOptions?: FindManyOptions<TModel>): Promise<TEntity[]> {
    try {
      const items = await this.repository.find(
        this.findManyOption(findManyOptions),
      );
      return items.map((item) => this.mapper.toDomain(item));
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async findOne(
    findOneOptions: FindOneOptions<TModel>,
  ): Promise<TEntity | undefined> {
    try {
      const item = await this.repository.findOne(
        this.findOneOption(findOneOptions),
      );
      return item ? this.mapper.toDomain(item) : undefined;
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async findAll(): Promise<TEntity[]> {
    try {
      const items: TModel[] = await this.repository.find(this.findManyOption());
      return items.map((item) => this.mapper.toDomain(item));
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async save(entity: TEntity): Promise<TEntity> {
    try {
      const domainToModelMapper: TModel = this.mapper.toPersistence(entity);
      const item: TModel = await this.repository.save(domainToModelMapper);
      return this.mapper.toDomain(item);
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async saveMany(entities: TEntity[]): Promise<TModel[]> {
    try {
      const modelsToSave: TModel[] = entities.map((entity: TEntity) =>
        this.mapper.toPersistence(entity),
      );
      return await this.repository.save(modelsToSave);
    } catch (error) {
      return throwApplicationError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }
}
