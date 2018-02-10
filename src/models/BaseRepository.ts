import {Document, DocumentQuery, Model, Query} from 'mongoose';

/**
 * Sets the base methods for every model created on this project.
 * T defines the mongoose document from where to base this repository
 * creations and Q defines the interface acceptable to create new objects.
 */
export class BaseRepository<T extends Document, Q> {
  /**
   * @param _model Defines the models on this repository.
   */
  constructor(private _model: Model<T>) {}

  /**
   * Creates an element from this model with the information given.
   * @param item The element to be stored.
   */
  create(item: T | Q): Promise<T> {
    return this.model.create(item);
  }

  /**
   * Retrieves all items at this repository.
   */
  retrieve(): DocumentQuery<T[], T> {
    return this.model.find({});
  }

  /**
   * Updates all items matching conditions given.
   * @param conditions Determines which objects to update
   * @param item New values for this.
   */
  update(conditions: Object, item: T | Q): Query<T> {
    return this.model.update(conditions, item);
  }

  /**
   * Deletes all objects matching conditions given.
   * @param conditions Sets which elements to remove.
   */
  delete(conditions: Object): Query<void> {
    return this.model.remove(conditions);
  }

  /**
   * Finds an element with the requested id.
   * @param id The id of the object to find.
   * @returns A query containing only one or none element with the given id.
   */
  findById(id: string): DocumentQuery<T, T> {
    return this.model.findById(id);
  }

  /**
   * Finds only one element from this repository matching the conditions.
   * @param conditions The conditions for this search.
   * @returns A query containing only one or none element matching the given
   * conditions.
   */
  findOne(conditions: Object): DocumentQuery<T, T> {
    return this.model.findOne(conditions);
  }

  /**
   * Finds all elements matching the given conditions.
   * @param conditions Sets the conditions for elements to retrieve.
   * @returns A query with all elements matching this conditions.
   */
  find(conditions: Object): DocumentQuery<T[], T> {
    return this.model.find(conditions);
  }

  /**
   * Gets the model ruling this repository.
   * @returns The model of this repository.
   */
  get model(): Model<T> {
    return this._model;
  }
}
