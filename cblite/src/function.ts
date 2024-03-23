import { Expression, FunctionExpression } from './expression';

export class Function {
  //---------------------------------------------
  // Aggregation
  //---------------------------------------------

  /**
   * Creates an AVG(expr) function expression that returns the average of all the number values
   * in the group of the values expressed by the given expression.
   *
   * @param expression The expression.
   * @return The AVG(expr) function.
   */
  static avg(expression: Expression) {
    return new FunctionExpression("AVG()", [expression]);
  }

  /**
   * Creates a COUNT(expr) function expression that returns the count of all values
   * in the group of the values expressed by the given expression.
   *
   * @param expression The expression.
   * @return The COUNT(expr) function.
   */
  static count(expression: Expression) {
      return new FunctionExpression("COUNT()", [expression]);
  } // null expression -> count *

  /**
   * Creates a MIN(expr) function expression that returns the minimum value
   * in the group of the values expressed by the given expression.
   *
   * @param expression The expression.
   * @return The MIN(expr) function.
   */
  static min(expression: Expression) {
      return new FunctionExpression("MIN()", [expression]);
  }

  /**
   * Creates a MAX(expr) function expression that returns the maximum value
   * in the group of the values expressed by the given expression.
   *
   * @param expression The expression.
   * @return The MAX(expr) function.
   */
  static max(expression: Expression) {
      return new FunctionExpression("MAX()", [expression]);
  }

  /**
   * Creates a SUM(expr) function expression that return the sum of all number values
   * in the group of the values expressed by the given expression.
   *
   * @param expression The expression.
   * @return The SUM(expr) function.
   */
  static sum(expression: Expression) {
      return new FunctionExpression("SUM()", [expression]);
  }

  //---------------------------------------------
  // Math
  //---------------------------------------------

  /**
   * Creates an ABS(expr) function that returns the absolute value of the given numeric
   * expression.
   *
   * @param expression The expression.
   * @return The ABS(expr) function.
   */
  static abs(expression: Expression) {
      return new FunctionExpression("ABS()", [expression]);
  }

  /**
   * Creates an ACOS(expr) function that returns the inverse cosine of the given numeric
   * expression.
   *
   * @param expression The expression.
   * @return The ACOS(expr) function.
   */
  static acos(expression: Expression) {
      return new FunctionExpression("ACOS()", [expression]);
  }

  /**
   * Creates an ASIN(expr) function that returns the inverse sin of the given numeric
   * expression.
   *
   * @param expression The expression.
   * @return The ASIN(expr) function.
   */
  static asin(expression: Expression) {
      return new FunctionExpression("ASIN()", [expression]);
  }

  /**
   * Creates an ATAN(expr) function that returns the inverse tangent of the numeric
   * expression.
   *
   * @param expression The expression.
   * @return The ATAN(expr) function.
   */
  static atan(expression: Expression) {
      return new FunctionExpression("ATAN()", [expression]);
  }

  /**
   * Returns the angle theta from the conversion of rectangular coordinates (x, y)
   * to polar coordinates (r, theta).
   *
   * @param x the abscissa coordinate
   * @param y the ordinate coordinate
   * @return the theta component of the point (r, theta) in polar coordinates that corresponds
   * to the point (x, y) in Cartesian coordinates.
   */
  static atan2(x: Expression, y: Expression) {
      return new FunctionExpression("ATAN2()", [x, y]);
  }

  /**
   * Creates a CEIL(expr) function that returns the ceiling value of the given numeric
   * expression.
   *
   * @param expression The expression.
   * @return The CEIL(expr) function.
   */
  static ceil(expression: Expression) {
      return new FunctionExpression("CEIL()", [expression]);
  }

  /**
   * Creates a COS(expr) function that returns the cosine of the given numeric expression.
   *
   * @param expression The expression.
   * @return The COS(expr) function.
   */
  static cos(expression: Expression) {
      return new FunctionExpression("COS()", [expression]);
  }

  /**
   * Creates a DEGREES(expr) function that returns the degrees value of the given radiants
   * value expression.
   *
   * @param expression The expression.
   * @return The DEGREES(expr) function.
   */
  static degrees(expression: Expression) {
      return new FunctionExpression("DEGREES()", [expression]);
  }

  /**
   * Creates a E() function that return the value of the mathemetical constant 'e'.
   *
   * @return The E() constant function.
   */
  static e() {
      return new FunctionExpression("E()", [null]);
  }

  /**
   * Creates a EXP(expr) function that returns the value of 'e' power by the given numeric
   * expression.
   *
   * @param expression The expression.
   * @return The EXP(expr) function.
   */
  static exp(expression: Expression) {
      return new FunctionExpression("EXP()", [expression]);
  }

  /**
   * Creates a FLOOR(expr) function that returns the floor value of the given
   * numeric expression.
   *
   * @param expression The expression.
   * @return The FLOOR(expr) function.
   */
  static floor(expression: Expression) {
      return new FunctionExpression("FLOOR()", [expression]);
  }

  /**
   * Creates a LN(expr) function that returns the natural log of the given numeric expression.
   *
   * @param expression The expression.
   * @return The LN(expr) function.
   */
  static ln(expression: Expression) {
      return new FunctionExpression("LN()", [expression]);
  }

  /**
   * Creates a LOG(expr) function that returns the base 10 log of the given numeric expression.
   *
   * @param expression The expression.
   * @return The LOG(expr) function.
   */
  static log(expression: Expression) {
      return new FunctionExpression("LOG()", [expression]);
  }

  /**
   * Creates a PI() function that returns the mathemetical constant Pi.
   *
   * @return The PI() constant function.
   */
  static pi() {
      return new FunctionExpression("PI()", [null]);
  }

  /**
   * Creates a POWER(base, exponent) function that returns the value of the given base
   * expression power the given exponent expression.
   *
   * @param base     The base expression.
   * @param exponent The exponent expression.
   * @return The POWER(base, exponent) function.
   */
  static power(base: Expression, exponent: Expression) {
      return new FunctionExpression("POWER()", [base, exponent]);
  }

  /**
   * Creates a RADIANS(expr) function that returns the radians value of the given degrees
   * value expression.
   *
   * @param expression The expression.
   * @return The RADIANS(expr) function.
   */
  static radians(expression: Expression) {
      return new FunctionExpression("RADIANS()", [expression]);
  }

  /**
   * Creates a ROUND(expr) function that returns the rounded value of the given numeric
   * expression.
   *
   * @param expression The expression.
   * @return The ROUND(expr) function.
   */
  static round(expression: Expression, digits: Expression = null) {
    return digits ? new FunctionExpression("ROUND()", [expression, digits]) : new FunctionExpression("ROUND()", [expression]);
  }

  /**
   * Creates a SIGN(expr) function that returns the sign (1: positive, -1: negative, 0: zero)
   * of the given numeric expression.
   *
   * @param expression The expression.
   * @return The SIGN(expr) function.
   */
  static sign(expression: Expression) {
      return new FunctionExpression("SIGN()", [expression]);
  }

  /**
   * Creates a SIN(expr) function that returns the sin of the given numeric expression.
   *
   * @param expression The numeric expression.
   * @return The SIN(expr) function.
   */
  static sin(expression: Expression) {
      return new FunctionExpression("SIN()", [expression]);
  }

  /**
   * Creates a SQRT(expr) function that returns the square root of the given numeric expression.
   *
   * @param expression The numeric expression.
   * @return The SQRT(expr) function.
   */
  static sqrt(expression: Expression) {
      return new FunctionExpression("SQRT()", [expression]);
  }

  /**
   * Creates a TAN(expr) function that returns the tangent of the given numeric expression.
   *
   * @param expression The numeric expression.
   * @return The TAN(expr) function.
   */
  static tan(expression: Expression) {
      return new FunctionExpression("TAN()", [expression]);
  }

  /**
   * Creates a TRUNC(expr) function that truncates all of the digits after the decimal place
   * of the given numeric expression.
   *
   * @param expression The numeric expression.
   * @return The trunc function.
   */
  static trunc(expression: Expression, digits: Expression = null) {
      return digits ? new FunctionExpression("TRUNC()", [expression, digits]) : new FunctionExpression("TRUNC()", [expression]);
  }

  //---------------------------------------------
  // String
  //---------------------------------------------

  /**
   * Creates a CONTAINS(expr, substr) function that evaluates whether the given string
   * expression conatins the given substring expression or not.
   *
   * @param expression The string expression.
   * @param substring  The substring expression.
   * @return The CONTAINS(expr, substr) function.
   */
  static contains(expression: Expression, substring: Expression) {
      return new FunctionExpression("CONTAINS()", [expression, substring]);
  }

  /**
   * Creates a LENGTH(expr) function that returns the length of the given string expression.
   *
   * @param expression The string expression.
   * @return The LENGTH(expr) function.
   */
  static len(expression: Expression) {
      return new FunctionExpression("LENGTH()", [expression]);
  }

  /**
   * Creates a LOWER(expr) function that returns the lowercase string of the given string
   * expression.
   *
   * @param expression The string expression.
   * @return The LOWER(expr) function.
   */
  static lower(expression: Expression) {
      return new FunctionExpression("LOWER()", [expression]);
  }

  /**
   * Creates a LTRIM(expr) function that removes the whitespace from the beginning of the
   * given string expression.
   *
   * @param expression The string expression.
   * @return The LTRIM(expr) function.
   */
  static ltrim(expression: Expression) {
      return new FunctionExpression("LTRIM()", [expression]);
  }

  /**
   * Creates a RTRIM(expr) function that removes the whitespace from the end of the
   * given string expression.
   *
   * @param expression The string expression.
   * @return The RTRIM(expr) function.
   */
  static rtrim(expression: Expression) {
      return new FunctionExpression("RTRIM()", [expression]);
  }

  /**
   * Creates a TRIM(expr) function that removes the whitespace from the beginning and
   * the end of the given string expression.
   *
   * @param expression The string expression.
   * @return The TRIM(expr) function.
   */
  static trim(expression: Expression) {
      return new FunctionExpression("TRIM()", [expression]);
  }

  /**
   * Creates a UPPER(expr) function that returns the uppercase string of the given string expression.
   *
   * @param expression The string expression.
   * @return The UPPER(expr) function.
   */
  static upper(expression: Expression) {
      return new FunctionExpression("UPPER()", [expression]);
  }
}