import { Expression } from "./expression";
import { Query } from './query';

export class Limit extends Query {
  constructor(private query: Query, public limit: Expression, public offset: Expression = null) {
    super();
    this.copy(query);
    this.setLimit(this);
  }

  asJSON() {
    const json = [this.limit.asJSON()];
    if (this.offset) {
      json.push(this.offset.asJSON());
    }
    return json;
  }

}