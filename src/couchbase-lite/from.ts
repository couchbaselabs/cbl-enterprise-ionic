import { Query} from "./query";
import { Expression } from './expression';
import { GroupBy } from './group-by';
import { Joins } from './joins';
import { Join } from './join';
import { Limit } from './limit';
import { Ordering } from './ordering';
import { OrderBy } from './order-by';
import { Where } from './where';
import { DataSource } from './data-source';

export class From extends Query {
  constructor(private query: Query, private dataSource: DataSource) {
    super();
    this.copy(query);
    this.setFrom(dataSource);
  }

  groupBy(...expressions: Expression[]) {
    return new GroupBy(this, expressions);
  }

  join(...joins: Join[]): Joins {
    return new Joins(this, joins);
  }

  limit(limit: Expression, offset: Expression = null) {
    return new Limit(this, limit, offset);
  }

  orderBy(...orderings: Ordering[]) {
    return new OrderBy(this, orderings);
  }

  where(expression: Expression) {
    return new Where(this, expression);
  }
}