import { SelectResult } from "./select-result";
import { Select } from './select';

export class QueryBuilder {
  /**
   * Create a SELECT statement instance that you can use further
   * (e.g. calling the from() function) to construct the complete query statement.
   */
  static select(...results: SelectResult[]): Select {
    return new Select(false, results);
  }

  /**
   * Create a SELECT DISTINCT statement instance that you can use further
   * (e.g. calling the from() function) to construct the complete query statement.
   */
  static selectDistinct(...results: SelectResult[]): Select {
    return new Select(true, results);
  }
}