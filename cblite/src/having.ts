import { Query } from './query';
import { Expression } from './expression';

export class Having extends Query {
  constructor(public query: Query, private expression: Expression) {
    super();
    this.copy(query);
    this.setHaving(this);
  }

  asJSON() {
    return this.expression && this.expression.asJSON() || null;
  }
}