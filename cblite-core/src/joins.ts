import { Join } from "./join";
import { Query } from './query';
import { Where } from './where';
import { Expression } from './expression';
import { Ordering } from './ordering';
import { OrderBy } from './order-by';
import { Limit } from './limit';

export class Joins extends Query {
  constructor(private query: Query, private joins: Join[]) {
    super();
    this.copy(query);
    this.setJoins(this);
  }

  where(expression: Expression): Where {
    return new Where(this, expression);
  }

  orderBy(...orderings: Ordering[]) {
    return new OrderBy(this, orderings);
  }

  limit(limit: Expression, offset: Expression = null) {
    return new Limit(this, limit, offset);
  }

  asJSON() {
    return this.joins.map(e => e.asJSON());
  }
}