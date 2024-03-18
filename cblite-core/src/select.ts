import { Query } from "./query";
import { DataSource } from './data-source';
import { From } from './from';
import { SelectResult } from './select-result';

export class Select extends Query {
  constructor(private distinct: boolean, private selectResults: SelectResult[]) {
    super();
    this.setSelect(this);
  }

  /**
   * Create and chain a FROM component for specifying the data source of the query.
   */
  from(dataSource: DataSource) {
    return new From(this, dataSource);
  }

  isDistinct() {
    return this.distinct;
  }

  getSelectResults() {
    return this.selectResults;
  }

  hasSelectResults() {
    return this.selectResults.length > 0;
  }

  asJSON() {
    return this.selectResults.map(e => e.asJSON());
  }
}