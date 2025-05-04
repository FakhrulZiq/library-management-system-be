/**
 * Interface for a data mapper that transforms between a domain entity and a persistence model.
 * Implementations of this interface should provide mapping behavior for converting between the
 * entity type (TEntity) used in the domain and the model type (TModel) used for data storage or transmission.
 */
export interface IMapper<TEntity, TModel> {
  toPersistence(entity: TEntity): TModel;
  toDomain(model: TModel): TEntity;
}
