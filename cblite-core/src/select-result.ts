import { Expression, PropertyExpression } from "./expression";

export class SelectResult {
  alias: string;

  constructor(protected expression: Expression) {
  }

  static property(property: string): SelectResultAs {
    return new SelectResultAs(PropertyExpression.property(property));
  }

  static expression(expression: Expression): SelectResultAs {
    return new SelectResultAs(expression);
  }

  static all(): SelectResultFrom {
    const expr = PropertyExpression.allFrom(null);
    return new SelectResultFrom(expr);
  }

  getColumnName() {
    if (this.alias != null) {
      return this.alias;
    }
    const exprAny = (this.expression as any);
    return exprAny.getColumnName && exprAny.getColumnName() || null;
  }

  asJSON() {
    return this.expression.asJSON();
  }
}

export class SelectResultAs extends SelectResult {
  constructor(expression: Expression = null) {
    super(expression);
  }

  as(alias: string) {
    this.alias = alias;
    return this;
  }

  asJSON() {
    let prop = super.asJSON();
    if (!this.alias) {
      return prop;
    }

    return ['AS', prop, this.alias];
  }
}
export class SelectResultFrom extends SelectResult {
  constructor(expression: Expression = null) {
    super(expression);
  }

  from(alias: string) {
    this.expression = PropertyExpression.allFrom(alias);
    this.alias = alias;
    return this;
  }
}