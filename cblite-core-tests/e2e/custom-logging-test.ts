import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';

/**
 * CustomLoggingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class CustomLoggingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCustomLoggingLevels(): Promise<ITestResult> {
    return {
      testName: 'testCustomLoggingLevels',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testEnableAndDisableCustomLogging(): Promise<ITestResult> {
    return {
      testName: 'testEnableAndDisableCustomLogging',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testNonASCII(): Promise<ITestResult> {
    return {
      testName: 'testNonASCII',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testPercentEscape(): Promise<ITestResult> {
    return {
      testName: 'testPercentEscape',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }


}
