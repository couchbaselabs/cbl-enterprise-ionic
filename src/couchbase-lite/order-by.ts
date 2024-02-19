import { Expression } from './expression';
import { Query } from './query';
import { Ordering } from './ordering';
import { Limit } from './limit';

export class OrderBy extends Query {
  constructor(private query: Query, public orderings: Ordering[]) {
    super();
    this.copy(query);
    this.setOrderBy(this);
  }

  limit(limit: Expression, offset: Expression = null) {
    return new Limit(this, limit, offset);
  }

  asJSON() {
    return this.orderings.map(e => e.asJSON());
  }
}