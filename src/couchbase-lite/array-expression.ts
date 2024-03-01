import { Expression } from './expression';
import { VariableExpression } from './variable-expression';

export const enum QuantifiesType { ANY, ANY_AND_EVERY, EVERY };
/**
 * Array functions.
 */
export class ArrayExpression {
  /**
   * Creates an ANY Quantified operator (ANY &lt;variable name&gt; IN &lt;expr&gt; SATISFIES &lt;expr&gt;)
   * with the given variable name. The method returns an IN clause object that is used for
   * specifying an array object or an expression evaluated as an array object, each item of
   * which will be evaluated against the satisfies expression.
   * The ANY operator returns TRUE if at least one of the items in the array satisfies the given
   * satisfies expression.
   *
   * @param variable The variable expression.
   * @return An In object
   */

  public static any(variable: VariableExpression) {
    return new ArrayExpressionIn(QuantifiesType.ANY, variable);
  }

  /**
   * Creates an EVERY Quantified operator (EVERY &lt;variable name&gt; IN &lt;expr&gt; SATISFIES &lt;expr&gt;)
   * with the given variable name. The method returns an IN clause object
   * that is used for specifying an array object or an expression evaluated as an array object,
   * each of which will be evaluated against the satisfies expression.
   * The EVERY operator returns TRUE if the array is empty OR every item in the array
   * satisfies the given satisfies expression.
   *
   * @param variable The variable expression.
   * @return An In object.
   */

  public static every(variable: VariableExpression) {
    return new ArrayExpressionIn(QuantifiesType.EVERY, variable);
  }

  /**
   * Creates an ANY AND EVERY Quantified operator (ANY AND EVERY &lt;variable name&gt; IN &lt;expr&gt;
   * SATISFIES &lt;expr&gt;) with the given variable name. The method returns an IN clause object
   * that is used for specifying an array object or an expression evaluated as an array object,
   * each of which will be evaluated against the satisfies expression.
   * The ANY AND EVERY operator returns TRUE if the array is NOT empty, and at least one of
   * the items in the array satisfies the given satisfies expression.
   *
   * @param variable The variable expression.
   * @return An In object.
   */

  public static anyAndEvery(variable: VariableExpression) {
    return new ArrayExpressionIn(QuantifiesType.ANY_AND_EVERY, variable);
  }

  /**
   * Creates a variable expression. The variable are used to represent each item in an array in the
   * quantified operators (ANY/ANY AND EVERY/EVERY &lt;variable name&gt; IN &lt;expr&gt; SATISFIES &lt;expr&gt;)
   * to evaluate expressions over an array.
   *
   * @param name The variable name
   * @return A variable expression
   */

  public static variable(name: string) {
    return new VariableExpression(name);
  }

}

/**
 * The In class represents the IN clause object in a quantified operator (ANY/ANY AND EVERY/EVERY
 * &lt;variable name&gt; IN &lt;expr&gt; SATISFIES &lt;expr&gt;). The IN clause is used for specifying an array
 * object or an expression evaluated as an array object, each item of which will be evaluated
 * against the satisfies expression.
 */
export class ArrayExpressionIn {
  constructor(private type: QuantifiesType, private variable: VariableExpression) {
  }

  /**
   * Creates a Satisfies clause object with the given IN clause expression that could be an
   * array object or an expression evaluated as an array object.
   *
   * @param expression the expression evaluated as an array object.
   * @return A Satisfies object.
   */
  public in(expression: Expression) {
    return new ArrayExpressionSatisfies(this.type, this.variable, expression);
  }
}

class QuantifiedExpression extends Expression {
  constructor(
     private type: QuantifiesType,
     private variable: VariableExpression,
     private inExpression: Expression,
     private satisfiedExpression: Expression) {
      super();
  }

  
  asJSON() {
    var json: any[] = [];

    // type
    switch (this.type) {
      case QuantifiesType.ANY:
        json.push("ANY");
        break;
      case QuantifiesType.ANY_AND_EVERY:
        json.push("ANY AND EVERY");
        break;
      case QuantifiesType.EVERY:
        json.push("EVERY");
        break;
    }

    // variable
    json.push(this.variable.getName());

    // in Expression
    json.push(this.inExpression.asJSON());

    // satisfies Expression
    json.push(this.satisfiedExpression.asJSON());

    return json;
  }
}
/**
 * The Satisfies class represents the SATISFIES clause object in a quantified operator
 * (ANY/ANY AND EVERY/EVERY &lt;variable name&gt; IN &lt;expr&gt; SATISFIES &lt;expr&gt;).
 * The SATISFIES clause is used for specifying an expression that will be used to evaluate
 * each item in the array.
 */
export class ArrayExpressionSatisfies {
  constructor(
    private type: QuantifiesType,
    private variable: VariableExpression,
    private inExpression: Expression) {
  }

  /**
   * Creates a complete quantified operator with the given satisfies expression.
   *
   * @param expression Parameter expression: The satisfies expression used for evaluating each item in the array.
   * @return The quantified expression.
   */
  
  public satisfies(expression: Expression) {
    return new QuantifiedExpression(this.type, this.variable, this.inExpression, expression);
  }
}