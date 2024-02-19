import { Query } from "./query";
import { Expression } from './expression';
import { GroupBy } from './group-by';
import { Ordering } from './ordering';
import { OrderBy } from './order-by';
import { Limit } from './limit';

export class Where extends Query {
  constructor(private query: Query, public where: Expression) {
    super();
    this.copy(query);
    this.setWhere(where);
  }

  groupBy(...expressions: Expression[]) {
    return new GroupBy(this, expressions);
  }

  orderBy(...orderings: Ordering[]) {
    return new OrderBy(this, orderings);
  }

  limit(limit: Expression, offset: Expression = null) {
    return new Limit(this, limit, offset);
  }
}