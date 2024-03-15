import { Expression } from "./expression";
import { Query } from './query';
import { Having } from './having';
import { Ordering } from './ordering';
import { OrderBy } from './order-by';
import { Limit } from './limit';

export class GroupBy extends Query {
  constructor(private query: Query, public expressions: Expression[]) {
    super();
    this.copy(query);
    this.setGroupBy(this);
  }

  having(expression: Expression) {
    return new Having(this, expression);
  }

  orderBy(...orderings: Ordering[]) {
    return new OrderBy(this, orderings);
  }

  limit(limit: Expression, offset: Expression = null) {
    return new Limit(this, limit, offset);
  }

  asJSON() {
    return this.expressions.map(e => e.asJSON());
  }
}