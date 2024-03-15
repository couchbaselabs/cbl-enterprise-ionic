import { Expression, FunctionExpression } from './expression';

/**
 * Array functions.
 */
export class ArrayFunction {
  /**
   * Creates an ARRAY_CONTAINS(expr, value) function that checks whether the given array
   * expression contains the given value or not.
   *
   * @param expression The expression that evaluate to an array.
   * @param value      The value to search for in the given array expression.
   * @return The ARRAY_CONTAINS(expr, value) function.
   */
  static contains(expression: Expression, value: Expression) {
    return new FunctionExpression('ARRAY_CONTAINS()', [expression, value]);
  }

  /**
   * Creates an ARRAY_LENGTH(expr) function that returns the length of the given array
   * expression.
   *
   * @param expression The expression that evluates to an array.
   * @return The ARRAY_LENGTH(expr) function.
   */
  static len(expression: Expression) {
    return new FunctionExpression('ARRAY_LENGTH()', [expression]);
  }
}