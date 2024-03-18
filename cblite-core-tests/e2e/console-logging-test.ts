import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * ConsoleLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class ConsoleLoggingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   * 
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testConsoleLoggingLevels(): Promise<ITestResult> {
    return {
      testName: 'testConsoleLoggingLevels',
      success: false,
      message: 'Not implemented',
      data: undefined
    };
  }
}
